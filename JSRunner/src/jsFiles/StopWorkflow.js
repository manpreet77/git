/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.34
   Stop Workflow
   This script stops the Workflow
   --------------------------------------------------------------------------------
*/
/* global Log,  Workflow */


Log.info(Workflow.WfLogPrefix + "Stopping workflow for incident id = {}", Workflow.InIncidentId);
Workflow.stop();


// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------