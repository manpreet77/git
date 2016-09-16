/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 Stage Dispatch for Ack
 This action loads dispatch maps and prepares a queue of dispatchs to be sent
 Sorted by ascending order of send time
 Then it emits an event with a 0 delay to kickoff the dispatch loop
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer, Contact */

Log.info("Stage Dispatch for Ack Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context



var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');


if (DispatchQueue === 'undefined') {
    Log.info("Initializing DispatchQueue...");
    DispatchQueue = new Array();
}



//for all other lifecycle events there is no need of ATM Schedule
// we will default to AnyHours in this case
var AtmSched = "AnyHours"; //default Atm Schedule

//Do the time calcuation in case there was a delay due to nextAvailableATMSchedule during Create time
var BaseDispatchStartTimeAsDate = new Date(Workflow.InStartTime);
if(Workflow.delayGapinMinsDueToNextAvailableAtmSchedule !== 'undefined' && Workflow.delayGapinMinsDueToNextAvailableAtmSchedule !== null){
    Log.info("Adding " + Workflow.delayGapinMinsDueToNextAvailableAtmSchedule + " in all timers due to Next Available ATM Schedule");
    BaseDispatchStartTimeAsDate = BaseDispatchStartTimeAsDate.setMinutes(BaseDispatchStartTimeAsDate.getMinutes() + Workflow.delayGapinMinsDueToNextAvailableAtmSchedule);                
}
    




Log.info("Args to QueryActionRule: actionrule= " + Workflow.ArName + ", tenantid= " + Workflow.TenantId + ", Schedule= " + AtmSched + ", Lifecycle= " + Workflow.WfLifecycle);

    var queryArResult = Contact.queryActionRuleWithNextAvaialbleUser({
        actionRule: Workflow.ArName,
        tenantId: Workflow.TenantId,
        atmSchedule: AtmSched,
        lifecycle: Workflow.WfLifecycle
    });

    if (!queryArResult) {
        Log.info("No contacts for dispatch were returned in QueryResult");
    } else {
        Log.info("QueryResult : " + JSON.stringify(queryArResult));

        var dmaps = queryArResult.partyDetails;
        if (dmaps) {

        Log.info("Dispatch Maps Name =  " + queryArResult.partyName + ", dmaps size = " + dmaps.length);
        Log.info('Dispatch Maps Data :  {}', JSON.stringify(dmaps));
        Log.info("BaseDispatchstartTime = " + BaseDispatchStartTimeAsDate);
        for (var i in dmaps) {
            var dq = {};
            /* Create, Ack...            */ dq.EventType = dmaps[i].lifeCycle;
            /* wait, done, retry, error  */ dq.Status = "new";
            /* Email, SMS...             */ dq.Channel = dmaps[i].contactChannel;
            /* Notification, Escalation  */ dq.ContactType = dmaps[i].contactType;
            
            //handling of SendTime and delay based on ContactType
            var DispatchStartTimeAsDate = new Date(BaseDispatchStartTimeAsDate);
            if(dq.ContactType === "Pre Breach Reminder"){
                //special handling of Pre-breach type 
                //in this case the duration has to be subtracted from the SLA and accordingly adjusted
                if(Workflow.WfLifecycle === "Ack"){
                    DispatchStartTimeAsDate = DispatchStartTimeAsDate.setMinutes((BaseDispatchStartTimeAsDate.getMinutes() + Workflow.ArAckSLA) - dmaps[i].duration.baseValueMinutes);                
                    
                }else if (Workflow.WfLifecycle === "Resolve"){
                    DispatchStartTimeAsDate = DispatchStartTimeAsDate.setMinutes((BaseDispatchStartTimeAsDate.getMinutes() + Workflow.ArRslSLA) - dmaps[i].duration.baseValueMinutes);                
                }
                
            }
            else{
                //for all other cases like notifications and escalations, duration needs to be added to basetime
                DispatchStartTimeAsDate = DispatchStartTimeAsDate.setMinutes(BaseDispatchStartTimeAsDate.getMinutes() + dmaps[i].duration.baseValueMinutes);                
            }
            
            
            
            /* When to be sent           */ dq.SendTime = new Date(DispatchStartTimeAsDate).toISOString();
/* unique id for all contacts belonging in this record*/
                dq.contactMapping = dmaps[i].contactMapping;

                /* if we have to wait for next contact or continue with next*/
                dq.waitForNextContact = dmaps[i].waitForNextContact;


                /* Template Type */
                dq.TemplateType = dmaps[i].template.templateType;
                /* Template for adaptor      */
                if (!dmaps[i].template.jsonDefinition) {
                    dq.Template = '';
                } else {
                    dq.Template = JSON.parse(dmaps[i].template.jsonDefinition);
                }

                /* If response can come      */
                if (dq.Channel === 'Voice' || dq.Channel === 'NCR-EDI' || dq.Channel === 'DECAL')
                    dq.WillRespond = 'yes';
                else
                    dq.WillRespond = 'no';

                if (dq.TemplateType === 'other') {
                    //template body has JSON for all the properties needed by this dispatch
                    //stored in the template
                    if (!dq.Template.body) {
                        dq.Template = '';
                    } else {
                        dq.Template.body = JSON.parse(dq.Template.body);
                    }

                    /* Time To Live */
                    if (dq.Template.body.Ttl) {
                        dq.Ttl = dq.Template.body.Ttl;
                    } else {
                        dq.Ttl = 3600;
                    }

                    /* Max Retries to be done */
                    if (dq.Template.body.MaxRetries) {
                        dq.MaxRetries = dq.Template.body.MaxRetries;
                    } else {
                        dq.MaxRetries = 0;
                    }
                }            
            //in case of breach ignore Notification and Pre-Breach Reminder type of Dispatch rules
            //only load Breach and Escalation Types
            if(Workflow.WfStatus    ===  'breached'){
                if(dq.ContactType === 'Breach' || dq.ContactType.startsWith("Escalation")){
                    //add to Q
                }else if (dq.ContactType === 'Notification' || dq.ContactType === "Pre Breach Reminder") {
                    //do not add to Q
                    continue;
                }
            }else if( Workflow.WfStatus    ===  'acked' || Workflow.WfStatus    ===  'resolved'){
                if (dq.ContactType !== 'Notification')
                    continue;
            }else if( Workflow.WfStatus    ===  'new'){
                if (dq.ContactType !== 'Pre Breach Reminder')
                    continue;
            }
            
            if (processUserBlockForCalendar(dmaps[i].user, dq)) {
                    if (dq.nextAvailableTime) {

                        Log.info("StageDispatchForAck: no current schedules found for the user, will have to sleep..");
                        // Kick off the stage delay since no current schedules are there
                        // Go to Sleep until next open time and come here instead of SendDispatch
                        var currTime = new Date();
                        Log.info('currTime: ' + currTime.toISOString());
                        var goTime = new Date(Date.parse(dq.nextAvailableTime));
                        Log.info('goTime: ' + goTime.toISOString());
                        var delayGapinMins = new Date(goTime - currTime).getMinutes();

                        Log.info("Going to sleep due to user not available for " + delayGapinMins + " mins");

                        Timer.start({
                            eventName: 'ei_stage_dispatch',
                            delayMs: delayGapinMins * 60 * 1000
                        });
                    }
                    else {
                        DispatchQueue.push(dq);
                    }
                }
        }
    }
    //  Sort the Queue by sendtime
    DispatchQueue.sort(function (a, b) {
        if (a.SendTime > b.SendTime)
            return 1;
        if (a.SendTime < b.SendTime)
            return -1;
        return 0;
    });
}
//  Save the Queue away
Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
Log.info("DispatchQueue = {}", Workflow.DispatchQueueStringify);
Log.info("Stage Dispatch for Ack Exiting...");


function processUserBlockForCalendar(users, dq) {
    var result = false;
    //  Sort the user array by seqNo
    if (users && users.length > 0) {
        users.sort(function (a, b) {
            if (a.sequenceNo > b.sequenceNo)
                return 1;
            if (a.sequenceNo < b.sequenceNo)
                return -1;
            return 0;
        });
    }

    for (var i in users) {
        var user = users[i];

        processForUserAddress(user, dq);

        if (user.isAvailable === true) {
            result = true;
            break;
        } else {
            if (dq.waitForNextContact) {
                dq.nextAvailableTime = user.nextAvailableTime;
                result = true;
                break;
            } else {
                continue;
            }
        }
    }
    return result;
}


function processForUserAddress(user, dq) {
    /* FN of the person          */
    dq.FirstName = user.firstName;
    /* LN of the person          */
    dq.LastName = user.lastName;

    /* Address Processing for Emailid, PhoneNum..       
     * check if there is a comma, there can be 2 addresses for one user
     * */
    var addressString = user.address;
    if (!addressString) {
        Log.info("No Address provided for this contact record, skipping it..");
        dq.Status = "error";
    } else {
        //try splitting on comma
        var addrArray = addressString.split(',');
        dq.Address = addrArray[0].trim();
        if (addrArray[1])
            dq.Address2 = addrArray[1].trim();
    }
}

//  --------------------------------------------------------------------------------
//  ESQ Management Solutions / ESQ Business Services
//  --------------------------------------------------------------------------------

