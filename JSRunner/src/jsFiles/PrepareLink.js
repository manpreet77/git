/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.28
   PrepareLink
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
/* global Log, Workflow */

Log.info("Prepare for Link Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus === 'active' || Workflow.WfStatus === 'acked' || Workflow.WfStatus === 'working' || Workflow.WfStatus === 'breached') {
    Workflow.WfLifecycle =  'Link';
    Workflow.WfStatus    =  'linked';  //????
}
// Copy Arrive details into WorkFlow [link time, link user]

Log.info("Prepare for Link Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






