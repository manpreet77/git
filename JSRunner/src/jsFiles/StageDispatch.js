/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 StageDispatchs
 This action loads dispatch maps and prepares a queue of dispatchs to be sent
 Sorted by ascending order of send time
 Then it emits an event with a 0 delay to kickoff the dispatch loop
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer, Contact */

Log.info("Stage Dispatch Entered...");
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
if( Workflow.delayGapinMinsDueToNextAvailableAtmSchedule !== null){
    Log.info("Adding " + Workflow.delayGapinMinsDueToNextAvailableAtmSchedule + " in all timers due to Next Available ATM Schedule");
    BaseDispatchStartTimeAsDate = BaseDispatchStartTimeAsDate.setMinutes(BaseDispatchStartTimeAsDate.getMinutes() + Workflow.delayGapinMinsDueToNextAvailableAtmSchedule);                
}
    




Log.info("Args to QueryActionRule: actionrule= " + Workflow.ArName + ", tenantid= " + Workflow.TenantId + ", Schedule= " + AtmSched + ", Lifecycle= " + Workflow.WfLifecycle);

var queryArResult = Contact.queryActionRule({
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
            /* delay duration            */ dq.DelayMins = dmaps[i].duration.baseValueMinutes;            
            /* OperationalHours...       */ dq.AtmSchedule = dmaps[i].atmSchedule;
            /* FN of the person          */ dq.FirstName = dmaps[i].user.firstName;
            /* LN of the person          */ dq.LastName = dmaps[i].user.lastName;
            /* Emailid, PhoneNum..       */ dq.Address = dmaps[i].user.address;
            /* FN of the person          */ dq.FirstName2 = dmaps[i].user.firstName;
            /* LN of the person          */ dq.LastName2 = dmaps[i].user.lastName;
            /* Emailid, PhoneNum..       */ dq.Address2 = dmaps[i].user.address;
            /* Data to be sent           */ dq.Content = 'undefined';
            /* Template for adaptor      */ dq.Template = dmaps[i].template;
            /* If response can come      */ dq.WillRespond = 'yes';
            /* Time To Live              */ dq.Ttl = 3600;
            /* Max Retries to be done    */ dq.MaxRetries = 0;
            /* Num of tries so far       */ dq.TryCount = 0;
            
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
            
            DispatchQueue.push(dq);
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

//  Kick off dispatch
Timer.start({
    eventName: 'ei_send_dispatch',
    delayMs: 0
});


Log.info("Stage Dispatch Exiting...");

//  --------------------------------------------------------------------------------
//  ESQ Management Solutions / ESQ Business Services
//  --------------------------------------------------------------------------------

