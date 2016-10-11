/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.29
   PrepareResolve
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
/* global Log, Workflow, Timer */

Log.info("Prepare for Resolve Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'resolved'
if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'acked' || Workflow.WfStatus ===  'working' || Workflow.WfStatus === 'breached') {
    Workflow.WfLifecycle =  'Resolve';
    Workflow.WfStatus    =  'resolved';
    Timer.cancel('ei_rsl_sla_breach');
    
    //loop through the dispatch queue and remove unneccesary timers 
    resetDispatchQueue('Resolve', 'Pre Breach Reminder');
    resetDispatchQueue('Resolve', 'Breach');
    resetDispatchQueue('Resolve', 'Escalation-L1');
    resetDispatchQueue('Resolve', 'Escalation-L2');
    resetDispatchQueue('Resolve', 'Escalation-L3');
    resetDispatchQueue('Resolve', 'Escalation-L4');
    
    //  Save the Queue away
    Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
    Log.info("DispatchQueue = {}", Workflow.DispatchQueueStringify);

}

Log.info("Prepare for Resolve Exiting...");


function resetDispatchQueue(eventType, contactType) {
    for (var i in DispatchQueue) {
        var dq = DispatchQueue[i];

        for (var j in dq.users) {

            var user = dq.users[j];

            //cancel all queue items that are not needed now
            if (dq.EventType === eventType && dq.ContactType === contactType && user.Status === 'new') {
                Log.info("Canceling the " + eventType + " SLA " + contactType + " Timer id = " + user.TimerId);
                user.Status = 'canceled';
                Timer.cancel('ei_send_dispatch', user.TimerId);
            }
        }
    }
}


// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






