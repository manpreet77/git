/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.8
   PrepareResolve
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
/* global Log, Workflow, Timer */

Log.info("Prepare for Resolve Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'resolved'
if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'acked' || Workflow.WfStatus ===  'working') {
    Workflow.WfLifecycle =  'Resolve';
    Workflow.WfStatus    =  'resolved';
    Timer.cancel('ei_rsl_sla_breach');
    
    //clean the DispatchQueue and setup for reload
    DispatchQueue.length = 0;
    Workflow.DispatchQueueStringify ='undefined';

}

Log.info("Prepare for Resolve Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






