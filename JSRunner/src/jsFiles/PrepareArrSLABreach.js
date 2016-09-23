/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.10
 PrepareArrSLABreach
 This script prepares actions and dispatch on an Arrival SLABreach
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow*/

Log.info("Prepare Arr SLA Breach Entered...");

//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');

// Set Variable WorkFlow.LifeCycle.State to 'Arrive'
if (Workflow.WfStatus === 'active' || Workflow.WfStatus === 'acked') {
    Workflow.WfLifecycle = 'Arrive';
    Workflow.WfStatus = 'breached';
    
    
    //clean the DispatchQueue and setup for reload
    DispatchQueue.length = 0;
    Workflow.DispatchQueueStringify ='undefined';

}


Log.info("Prepare Arr SLA Breach Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
