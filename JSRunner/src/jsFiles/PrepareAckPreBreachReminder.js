/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 PrepareAckPreBreachReminder
 This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
 */

Log.info("Prepare for AckPreBreachReminder ...");

//fake out the WflifeCycle as "Ack" to load all pre-breach reminders nin Stage Dispatch
Workflow.WfLifecycle =  'Ack';
    

Log.info("Prepare for AckPreBreachReminder Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------

