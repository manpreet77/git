/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.15
   PrepareRslSLABreach
   This script prepares actions and dispatch on an Resolution SLABreach
   --------------------------------------------------------------------------------
*/
/* global Log, Timer, Event, Workflow */

Log.info("Prepare Rsl SLA Breach Entered...");

//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');

if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'acked' || Workflow.WfStatus ===  'working' || Workflow.WfStatus ===  'breached') {
    Workflow.WfLifecycle =  'Resolve';
    Workflow.WfStatus    =  'breached';
    
    //loop through the dispatch queue and remove unneccesary timers 
    resetDispatchQueue('Resolve', 'Pre Breach Reminder');
    
    //  Save the Queue away
    Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
    Log.info("DispatchQueue = {}", Workflow.DispatchQueueStringify);

}

Log.info("Prepare Rsl SLA Breach Exiting...");


function resetDispatchQueue(eventType, contactType){
    for (var i in DispatchQueue) {
        var dq = DispatchQueue[i];

        for (var j in dq.users) {

            var user = dq.users[j];

            //cancel all queue items that are not needed now
            if (dq.EventType === eventType && dq.ContactType === contactType) {
                if (user.Status === 'new'){
                    Log.info("Canceling the " + eventType + " SLA " + contactType + " Timer..");
                    user.Status = 'canceled';
                }else               
                if (user.Status === 'wait'){
                    user.Status = 'canceled';
                    Log.info("Canceling the " + eventType + " SLA " + contactType + " in play Timer..");
                    Timer.cancel('ei_send_dispatch');
                } 
                    
            }
        }
    }
}


// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
