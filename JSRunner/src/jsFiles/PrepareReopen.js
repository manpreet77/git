/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.5
   PrepareReopen
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
/* global Log, Workflow */

Log.info("Prepare for Reopen Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus === 'resolved') {
    Workflow.WfLifecycle =  'reopen';
    Workflow.WfStatus    =  'reopened';
}
// Copy reopem details into WorkFlow [reopen time, reopen user]

Log.info("Prepare for Reopen Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






