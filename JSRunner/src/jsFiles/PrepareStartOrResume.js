/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.38
 PrepareStartOrResume
 This script prepares actions and dispatch on an Start or Resume
 --------------------------------------------------------------------------------
 */

/* global Log, Workflow, Timer */
Log.info(Workflow.WfLogPrefix + "Prepare for Start/Resume Work Entered");

//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'onHold' || Workflow.WfStatus === 'acked' || Workflow.WfStatus === 'breached') {
    
    if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'onHold') {
        Log.info(Workflow.WfLogPrefix + "Canceling the ACK SLA Breach Timer..");
        Timer.cancel('ei_ack_sla_breach');
        //loop through the dispatch queue and remove unneccesary timers 
        resetDispatchQueue('Ack', 'Pre Breach Reminder');
        resetDispatchQueue('Ack', 'Breach');
        resetDispatchQueue('Ack', 'Escalation-L1');
        resetDispatchQueue('Ack', 'Escalation-L2');
        resetDispatchQueue('Ack', 'Escalation-L3');
        resetDispatchQueue('Ack', 'Escalation-L4');
    } 
    
     if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'acked') {
        Workflow.WfLifecycle = 'Work';
     }else if(Workflow.WfStatus === 'onHold'){
        Workflow.WfLifecycle = 'Resume';
    }    
    
    Workflow.WfStatus = 'working';

    //  Save the Queue away
    Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
    Log.debug(Workflow.WfLogPrefix + "DispatchQueue = {}", Workflow.DispatchQueueStringify);
}

Log.info(Workflow.WfLogPrefix + "Prepare for Start/Resume Work Exiting...");


function resetDispatchQueue(eventType, contactType) {
    for (var i in DispatchQueue) {
        var dq = DispatchQueue[i];

        for (var j in dq.users) {

            var user = dq.users[j];

            //cancel all queue items that are not needed now
            if (dq.EventType === eventType && dq.ContactType === contactType && user.Status === 'new') {
                Log.info(Workflow.WfLogPrefix + "Canceling the " + eventType + " SLA " + contactType + " Timer id = " + user.TimerId);
                user.Status = 'canceled';
                Timer.cancel('ei_send_dispatch', user.TimerId);
            }
        }
    }
}
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------


