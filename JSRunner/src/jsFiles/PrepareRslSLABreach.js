/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   PrepareRslSLABreach
   This script prepares actions and dispatch on an Resolution SLABreach
   --------------------------------------------------------------------------------
*/
/* global Log, Timer, Event */

Log.info("Prepare Rsl SLA Breach Entered...");

if (Workflow.WfStatus === 'new' || Workflow.WfStatus === 'acked' || Workflow.WfStatus ===  'working') {
    Workflow.WfLifecycle =  'Resolve';
    Workflow.WfStatus    =  'breached';
    
    //clean the DispatchQueue and setup for reload
    DispatchQueue.length = 0;
    Workflow.DispatchQueueStringify ='undefined';

}


Log.info("Prepare Rsl SLA Breach Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
