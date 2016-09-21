/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.8
   PrepareHold
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
/* global Log, Workflow */

Log.info("Prepare for Hold Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'Hold'
if (Workflow.WfStatus === 'active' || Workflow.WfStatus === 'acked' || Workflow.WfStatus ===  'working') {
    Workflow.WfLifecycle =  'Hold';
    Workflow.WfStatus    =  'onHold';
}
// Copy Hold details into WorkFlow [hold time, hold user]

Log.info("Prepare for Hold Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






