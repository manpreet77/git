/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   LogWorkflow
   Utility for designer to view current workflow values
   --------------------------------------------------------------------------------
*/
Log.info("Logging Workflow Entering................................................");

var s1 = Workflow.toString();
s2 = s1.replace(/,/g,'\n');
Log.info (s2);

Log.info("Logging Workflow Exitting ...............................................");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------