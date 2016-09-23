/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.12
SetLifecyletoCreate
 This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
 */

Log.info("Prepare for SetLifecyletoCreate ...");

//reset back he WflifeCycle as "Create" to load all pre-breach reminders in Stage Dispatch
Workflow.WfLifecycle =  'Create';
   

Log.info("Prepare for SetLifecyletoCreate Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------


