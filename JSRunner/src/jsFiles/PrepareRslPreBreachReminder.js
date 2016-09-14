/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 PrepareRslPreBreachReminder
 This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
 */

Log.info("Prepare for RslPreBreachReminder ...");

//fake out the WflifeCycle as "Resolve" to load all pre-breach reminders nin Stage Dispatch
Workflow.WfLifecycle =  'Resolve';
    

Log.info("Prepare for RslPreBreachReminder Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------


