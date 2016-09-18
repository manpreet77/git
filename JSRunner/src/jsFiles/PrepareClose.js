/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.3
   PrepareClose
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
/* global Log, Workflow */

Log.info("Prepare for Close Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus !== 'closed') {
    Workflow.WfLifecycle =  'Close';
    Workflow.WfStatus    =  'closed';
} else {
    Log.info(': current State = ' + Workflow.WfStatus + ' event ignored');
}
// Copy Close details into WorkFlow [Close time, Close user]

Log.info("Prepare for Close Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






