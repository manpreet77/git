/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.29
   LogEvent
   Utility for designer to view current Event values
   --------------------------------------------------------------------------------
*/
/* global Log, Event */

Log.info("Logging Event Entering................................................");

var s1 = Event.toString();
s2 = s1.replace(/,/g,'\n');
Log.info (s2);

Log.info("Logging Event Exitting ...............................................");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
