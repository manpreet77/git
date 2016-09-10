/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 PrepareETA
 This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer */

Log.info("Prepare for ETA Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'resumed' || Workflow.WfStatus === 'reopened') {
    var ArrSLABreachDelay = 0;
    // CALCULATE THIS FROM ETA
    Timer.start({
        eventName: 'ei_arr_sla_breach',
        delayMs: Workflow.ArrSLABreachDelay * 60 * 1000
    });
    // Copy Ack details into WorkFlow [ack time, ack user]

}
Log.info("Prepare for ETA Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






