/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.38
   PrepareRslSLABreach
   This script prepares actions and dispatch on an Resolution SLABreach
   --------------------------------------------------------------------------------
*/
/* global Log, Timer, Event, Workflow */

Log.info(Workflow.WfLogPrefix + "Prepare Rsl SLA Breach Entered...");

//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');

if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'acked' || Workflow.WfStatus ===  'working' || Workflow.WfStatus === 'onHold' || Workflow.WfStatus ===  'breached') {
    Workflow.WfLifecycle =  'Resolve';
    Workflow.WfStatus    =  'breached';
    
    //loop through the dispatch queue and remove unneccesary timers 
    resetDispatchQueue('Resolve', 'Pre Breach Reminder');
    
    //  Save the Queue away
    Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
    Log.debug(Workflow.WfLogPrefix + "DispatchQueue = {}", Workflow.DispatchQueueStringify);

}

Log.info(Workflow.WfLogPrefix + "Prepare Rsl SLA Breach Exiting...");


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
