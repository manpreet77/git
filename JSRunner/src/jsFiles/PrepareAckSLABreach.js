/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.9
   PrepareAckSLABreach
   This script prepares actions and dispatch on an AckSLABreach
   --------------------------------------------------------------------------------
*/
/* global Log, Workflow */

Log.info("Prepare Ack SLA Breach Entered...");

//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');

// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'resumed' || Workflow.WfStatus === 'reopened') {
    Workflow.WfLifecycle =  'Ack';
    Workflow.WfStatus    =  'breached';
    
    //clean the DispatchQueue and setup for reload
    DispatchQueue.length = 0;
    Workflow.DispatchQueueStringify ='undefined';
}

Log.info("Prepare Ack SLA Breach Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
