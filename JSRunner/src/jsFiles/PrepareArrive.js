/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.38
 PrepareArr
 This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer */

Log.info(Workflow.WfLogPrefix + "Prepare for Arrive Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'Arrive'
if (Workflow.WfStatus === 'active' || Workflow.WfStatus === 'acked' || Workflow.WfStatus ===  'breached') {
    Workflow.WfLifecycle = 'Arrive';
    Workflow.WfStatus = 'working';
    Log.info(Workflow.WfLogPrefix + "Changed Workflow Lifecycle = " + Workflow.WfLifecycle + ", Status = " + Workflow.WfStatus);
    Log.info(Workflow.WfLogPrefix + "Canceling the Arrival SLA Breach Timer..");
    Timer.cancel('ei_arr_sla_breach');
    
    //loop through the dispatch queue and remove unneccesary timers 
    resetDispatchQueue('Arrive', 'Pre Breach Reminder');
    resetDispatchQueue('Arrive', 'Breach');
    resetDispatchQueue('Arrive', 'Escalation-L1');
    resetDispatchQueue('Arrive', 'Escalation-L2');
    resetDispatchQueue('Arrive', 'Escalation-L3');
    resetDispatchQueue('Arrive', 'Escalation-L4');
    
    //  Save the Queue away
    Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
    Log.debug(Workflow.WfLogPrefix + "DispatchQueue = {}", Workflow.DispatchQueueStringify);

}


Log.info(Workflow.WfLogPrefix + "Prepare for Arrive Exiting...");

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






