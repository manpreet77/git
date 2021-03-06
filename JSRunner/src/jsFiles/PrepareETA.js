/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.38
 PrepareETA
 This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer */

Log.info(Workflow.WfLogPrefix + "Prepare for ETA Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'resumed' || Workflow.WfStatus === 'reopened' || Workflow.WfStatus === 'breached') {
    var ArrSLABreachDelay = 0;
    /* CALCULATE THIS FROM ETA
    Timer.start({
        eventName: 'ei_arr_sla_breach',
        delayMs: Workflow.ArArrSLA * 60 * 1000
    });*/
}
Log.info(Workflow.WfLogPrefix + "Prepare for ETA Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






