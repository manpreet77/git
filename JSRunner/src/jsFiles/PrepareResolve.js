/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.38
 PrepareResolve
 This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer */

Log.info(Workflow.WfLogPrefix + "Prepare for Resolve Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'resolved'
if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'acked' || Workflow.WfStatus === 'working' || Workflow.WfStatus === 'breached') {
    Workflow.WfLifecycle = 'Resolve';
    Workflow.WfStatus = 'resolved';
    Log.info(Workflow.WfLogPrefix + "Changed Workflow Lifecycle = " + Workflow.WfLifecycle + ", Status = " + Workflow.WfStatus);
    Log.info(Workflow.WfLogPrefix + "Canceling the Resolve SLA Breach Timer..");
    Timer.cancel('ei_rsl_sla_breach');

    //loop through the dispatch queue and remove unneccesary timers 
    if (Workflow.WfStatus === 'new') {
        resetDispatchQueue('Ack', 'Pre Breach Reminder');
        resetDispatchQueue('Ack', 'Breach');
        resetDispatchQueue('Ack', 'Escalation-L1');
        resetDispatchQueue('Ack', 'Escalation-L2');
        resetDispatchQueue('Ack', 'Escalation-L3');
        resetDispatchQueue('Ack', 'Escalation-L4');
    }
    resetDispatchQueue('Resolve', 'Pre Breach Reminder');
    resetDispatchQueue('Resolve', 'Breach');
    resetDispatchQueue('Resolve', 'Escalation-L1');
    resetDispatchQueue('Resolve', 'Escalation-L2');
    resetDispatchQueue('Resolve', 'Escalation-L3');
    resetDispatchQueue('Resolve', 'Escalation-L4');

    //  Save the Queue away
    Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
    Log.debug(Workflow.WfLogPrefix + "DispatchQueue = {}", Workflow.DispatchQueueStringify);

}

Log.info(Workflow.WfLogPrefix + "Prepare for Resolve Exiting...");


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






