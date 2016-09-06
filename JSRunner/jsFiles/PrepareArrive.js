/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   PrepareArr
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
Log.info("Prepare for Arrive Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus == 'active' || Workflow.WfStatus == 'acked') {
    Workflow.WfLifecycle =  'arrived';
    Workflow.WfStatus    =  'working';
    Timer.stop('ei_arr_sla_breach');
}
// Copy Arrive details into WorkFlow [arrive time, arrive user]

Log.info("Prepare for Arrive Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






