/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   PrepareAck
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
Log.info("Prepare for Ack Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus == 'new' || Workflow.WfStatus == 'resumed' || Workflow.WfStatus == 'reopened') {
    Workflow.WfLifecycle =  'ack';
    Workflow.WfStatus    =  'acked';
    Timer.stop('ei_ack_sla_breach');
    
    var ArrSLABreachDelay;
    // CALCULATE THIS FROM ETA
    Timer.start('ei_arr_sla_breach', ArrSLABreachDelay);
    // Copy Ack details into WorkFlow [ack time, ack user]
    
}
Log.info("Prepare for Ack Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






