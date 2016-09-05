/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   PrepareResolve
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
Log.info("Prepare for Resolve Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus == 'active' or 'acked' or 'working') {
    Workflow.WfLifeCycle =  'resolve';
    Workflow.WfStatus    =  'Resolved';
}
// Copy Arrive details into WorkFlow [resolve time, resolve user]

Log.info("Prepare for Resolve Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






