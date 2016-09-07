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
Log.info("Stage Dispatch Entered...");

//  Restore DispatchQueue from Stringfy version in Workflow context

var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');

//  Get duration, template, schedule, party
//  Load DispatchMaps
if (DispatchQueue === 'undefined') {
    Log.info("Initializing DispatchQueue...");
    DispatchQueue = new Array();

    var AtmSched = 'NextHrs';
    if (Workflow.OprHrs == 'Y') {
        AtmSched = 'OprHrs'
    } else if (Workflow.AftHrs == 'Y') {
        AtmSched = 'AftHrs'
    } else if (Workflow.OffHrs == 'Y') {
        AtmSched = 'OffHrs'
    }
    Log.info("Args to QueryActionRule: actionrule= " + Workflow.ArName + ", tenantid= " + Workflow.TenantId + "lifecycle= " + Workflow.WfLifecycle);
    var queryArResult = Contact.queryActionRule({
        actionRule: Workflow.ArName,
        tenantId: Workflow.TenantId,
        lifecycle: Workflow.WfLifecycle
    });
    var dmaps = queryArResult.partyDetails;

    Log.info("Dispatch Maps Name =  " + queryArResult.partyName + ", dmaps size = " + dmaps.length);
    Log.info('Dispatch Maps Data :  {}', JSON.stringify(dmaps));

    var BaseDispatchStartTimeAsDate;
    var DispatchStartTimeAsDate;
    var BaseStatus = 'new'
    if (AtmSched == 'NextHrs') {
        BaseDispatchStartTimeAsDate = new Date(Date.parse(queryArResult.nextWindow));
        BaseStatus = 'defef';
    } else {
        BaseDispatchStartTimeasDate = new Date(Date.parse(Workflow.InStartTime));
    }
    for (var i in dmaps) {
        var dq = {};
        /* Create, Ack...            */ dq.EventType = dmaps[i].lifeCycle;
        var DispatchStartTimeAsDate = BaseDispatchStartTimeAsDate.setMinutes(BaseDispatchStartTimeAsDate.getMinutes() + dmaps[i].duration.baseValueMinutes);
        /* When to be sent           */ dq.SendTime = new Date(DispatchStartTime).toISOString();
        /* delay duration            */ dq.DelayMins = dmaps[i].duration.baseValueMinutes;
        /* wait, done, retry, error  */ dq.Status = BaseStatus;
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
    return 0;
});

//  Save the Queue away
Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);

Log.info("DispatchQueue = {}", Workflow.DispatchQueueStringify);

//  Kick off the sending of notifications
var delayMs = 0;
if (AtmSched == 'NextHrs') {
    var currTime = new Date();
    Log.info('currTime: ' + currTime.toISOString());
    var goTime = new Date(Date.parse(dq.DispatchStartTimeAsDate));
    Log.info('goTime: ' + goTime.toISOString());
    var delayGapinMins = new Date (goTime - currTime).getMinutes();
    delayMs = delayGapMins * 60 * 1000;
}
Timer.start({
    eventName: 'ei_send_dispatch',
    delayMs: 0
});


Log.info("Stage Dispatch Exiting...");
//  --------------------------------------------------------------------------------
//  ESQ Management Solutions / ESQ Business Services
//  --------------------------------------------------------------------------------
