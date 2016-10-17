/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.35
   PrepareHold
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
/* global Log, Workflow */

Log.info(Workflow.WfLogPrefix + "Prepare for Hold Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'Hold'
if (Workflow.WfStatus === 'active' || Workflow.WfStatus === 'new' || Workflow.WfStatus === 'acked' || Workflow.WfStatus ===  'working' || Workflow.WfStatus === 'breached') {
    Workflow.WfLifecycle =  'Hold';
    Workflow.WfStatus    =  'onHold';
    Log.info(Workflow.WfLogPrefix + "Changed Workflow Lifecycle = " + Workflow.WfLifecycle + ", Status = " + Workflow.WfStatus);
}
// Copy Hold details into WorkFlow [hold time, hold user]

Log.info(Workflow.WfLogPrefix + "Prepare for Hold Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






