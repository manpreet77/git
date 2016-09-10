/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 StageDispatchs
 This action loads dispatch maps and prepares a queue of dispatchs to be sent
 Sorted by ascending order of send time
 Then it emits an event with a 0 delay to kickoff the send email loop
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer, Contact */

Log.info("Stage Dispatch Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context

var AtmSched = "BranchHours"; //default Atm Schedule

var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');


if (DispatchQueue === 'undefined') {
    Log.info("Initializing DispatchQueue...");
    DispatchQueue = new Array();
}


//check for atmschedules: either current time falls in one of the atmschedules or not
//in case it does not, sleep till next available time
if (Workflow.InIsInATMBranchHours == 0 &&
        Workflow.InIsInATMAfterHours == 0 &&
        Workflow.InIsInATMOtherHours == 0 &&
        Workflow.InIsInATMOperHours == 0 &&
        Workflow.InNextATMSchedAvailableTime != null) {

    Log.info("StageDispatch: no current schedules found, will have to sleep..");
//  Kick off the stage delay since no current schedules are there
    // Go to Sleep until next open time and come here instead of SendDispatch
    var currTime = new Date();
    Log.info('currTime: ' + currTime.toISOString());
    var goTime = new Date(Date.parse(Workflow.InNextATMSchedAvailableTime));
    Log.info('goTime: ' + goTime.toISOString());
    var delayGapinMins = new Date(goTime - currTime).getMinutes();
    
    
    Log.info("Going to sleep for " + delayGapinMins + " mins");
    Workflow.InNextATMSchedAvailableTime = null;
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
        Log.info("StageDispatch: staging dispatch normal");
        AtmSched = 'BranchHours';
    } else if (Workflow.InIsInATMAfterHours === "1") {
        Log.info("StageDispatch: staging dispatch normal");
        AtmSched = 'AfterHours';
    } else if (Workflow.InIsInATMOtherHours === "1") {
        Log.info("StageDispatch: staging dispatch normal");
        AtmSched = 'OtherHours';
    } else if (Workflow.InIsInATMOperHours === "1") {
        Log.info("StageDispatch: staging dispatch normal");
        AtmSched = 'OperationalHours';
    } else {
        Log.info("StageDispatch: staging dispatch after sleep");
        //in case of coming back after sleeping, set base DSPstarttime as current time
        BaseDispatchStartTimeAsDate = new Date();
        switch(Workflow.InNextATMSchedAvailable){
            case 'OPERHR':
                AtmSched = "OperationalHours";
                break;
            case 'BRNCHR': 
                AtmSched = "BranchHours";
                break;
            case 'AFTRHR':
                AtmSched = "AfterHours";
                break;
            case 'OTHRHR':
                AtmSched = "OtherHours";
                break;
            //TODO case 'PEAKHR':
            //TODO case 'OFPKHR':
            default:
                break;
        }
    } 
    
    
    
    Log.info("Args to QueryActionRule: actionrule= " + Workflow.ArName + ", tenantid= " + Workflow.TenantId + ", Schedule= " + AtmSched + ", Lifecycle= " + Workflow.WfLifecycle);
    
    var queryArResult = Contact.queryActionRule({
        actionRule: Workflow.ArName,
        tenantId: Workflow.TenantId,
        atmSchedule: AtmSched,
        lifecycle: Workflow.WfLifecycle
    });
  
     Log.info("QueryResult : " + JSON.stringify(queryArResult));
     
    var dmaps = queryArResult.partyDetails;
        if (dmaps != 'undefined') {
          
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
            /* Base, Level-1...          */ dq.Level = dmaps[i].level;
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
//  Save the Queue away
    Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
    Log.info("DispatchQueue = {}", Workflow.DispatchQueueStringify);
    
    //  Kick off the sending of notifications
    Timer.start({
        eventName: 'ei_send_dispatch',
        delayMs: 0
    });
}

Log.info("Stage Dispatch Exiting...");

//  --------------------------------------------------------------------------------
//  ESQ Management Solutions / ESQ Business Services
//  --------------------------------------------------------------------------------

