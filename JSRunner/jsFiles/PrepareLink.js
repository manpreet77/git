/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   PrepareLink
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
Log.info("Prepare for Link Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus == 'active' or 'acked' or 'working') {
    Workflow.WfLifeCycle =  'link';
    Workflow.WfStatus    =  'linked';  //????
}
// Copy Arrive details into WorkFlow [link time, link user]

Log.info("Prepare for Link Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






