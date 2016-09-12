/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 PrepareArrSLABreach
 This script prepares actions and dispatch on an Arrival SLABreach
 --------------------------------------------------------------------------------
 */
/* global Log*/

Log.info("Prepare Arr SLA Breach Entered...");

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
