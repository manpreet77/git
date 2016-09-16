/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 StageDispatch for Create
 This action loads dispatch maps and prepares a queue of dispatchs to be sent
 Sorted by ascending order of send time
 Then it emits an event with a 0 delay to kickoff the dispatch loop
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer, Contact */

Log.info("Stage Dispatch for Create Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context

var AtmSched = "BranchHours"; //default Atm Schedule

var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');


if (DispatchQueue === 'undefined') {
    Log.info("Initializing DispatchQueue...");
    DispatchQueue = new Array();
}


//check for atmschedules: either current time falls in one of the atmschedules or not
//in case it does not, sleep till next available time
if (Workflow.InIsInATMBranchHours === "0" &&
        Workflow.InIsInATMAfterHours === "0" &&
        Workflow.InIsInATMOtherHours === "0" &&
        Workflow.InIsInATMOperationalHours === "0" &&
        Workflow.InNextATMSchedAvailableTime !== 'undefined') {

    Log.info("StageDispatchForCreate: no current schedules found, will have to sleep..");
//  Kick off the stage delay since no current schedules are there
    // Go to Sleep until next open time and come here instead of SendDispatch
    var currTime = new Date();
    Log.info('currTime: ' + currTime.toISOString());
    var goTime = new Date(Date.parse(Workflow.InNextATMSchedAvailableTime));
    Log.info('goTime: ' + goTime.toISOString());
    var delayGapinMins = new Date(goTime - currTime).getMinutes();

    Workflow.delayGapinMinsDueToNextAvailableAtmSchedule = delayGapinMins;

    Log.info("Going to sleep for " + delayGapinMins + " mins");
    Workflow.InNextATMSchedAvailableTime = 'undefined';
    Timer.start({
        eventName: 'ei_stage_dispatch',
        delayMs: delayGapinMins * 60 * 1000
    });

} else {
    //in normal case set the DSP Start time as Incident Start Time
    Log.info(Workflow.InStartTime);
    var BaseDispatchStartTimeAsDate = new Date(Workflow.InStartTime);

    //Incident Time falls in one of the atm schedule
    if (Workflow.InIsInATMBranchHours === "1") {
        AtmSched = 'BranchHours';
    } else if (Workflow.InIsInATMAfterHours === "1") {
        AtmSched = 'AfterHours';
    } else if (Workflow.InIsInATMOtherHours === "1") {
        AtmSched = 'OtherHours';
    } else if (Workflow.InIsInATMOperHours === "1") {
        AtmSched = 'OperationalHours';
    } else {
        Log.info("StageDispatch: staging dispatch after sleep");
        //in case of coming back after sleeping, set base DSPstarttime as current time
        BaseDispatchStartTimeAsDate = new Date();
        AtmSched = Workflow.InNextATMSchedAvailable;
        //TODO case 'PeakHours':
        //TODO case 'OffPeakHours':
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

                var DispatchStartTimeAsDate = new Date();
                DispatchStartTimeAsDate = DispatchStartTimeAsDate.setMinutes(BaseDispatchStartTimeAsDate.getMinutes() + dmaps[i].duration.baseValueMinutes);


                /* When to be sent           */ dq.SendTime = new Date(DispatchStartTimeAsDate).toISOString();
                /* delay duration            */ dq.DelayMins = dmaps[i].duration.baseValueMinutes;
                /* wait, done, retry, error  */ dq.Status = "new";
                /* Email, SMS...             */ dq.Channel = dmaps[i].contactChannel;
                /* Notification, Escalation  */ dq.ContactType = dmaps[i].contactType;
                /* OperationalHours...       */ dq.AtmSchedule = dmaps[i].atmSchedule;

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


                if (processUserBlockForCalendar(dmaps[i].user, dq)) {
                    if (dq.nextAvailableTime) {

                        Log.info("StageDispatchForCreate: no current schedules found for the user, will have to sleep..");
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
}

Log.info("Stage Dispatch For Create Exiting...");


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


