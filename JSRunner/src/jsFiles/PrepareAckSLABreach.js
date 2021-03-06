/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.38
   PrepareAckSLABreach
   This script prepares actions and dispatch on an AckSLABreach
   --------------------------------------------------------------------------------
*/
/* global Log, Workflow */

Log.info(Workflow.WfLogPrefix + "Prepare Ack SLA Breach Entered...");

//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');

// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'resumed' || Workflow.WfStatus === 'reopened' || Workflow.WfStatus === 'onHold') {
    Workflow.WfLifecycle =  'Ack';
    Workflow.WfStatus    =  'breached';
    Log.info(Workflow.WfLogPrefix + "Changed Workflow Lifecycle = " + Workflow.WfLifecycle + ", Status = " + Workflow.WfStatus);
    //loop through the dispatch queue and remove unneccesary timers 
    resetDispatchQueue('Ack', 'Pre Breach Reminder');
    
    //  Save the Queue away
    Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
    Log.debug(Workflow.WfLogPrefix + "DispatchQueue = {}", Workflow.DispatchQueueStringify);
}



Log.info(Workflow.WfLogPrefix + "Prepare Ack SLA Breach Exiting...");

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
