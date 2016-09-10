/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   PrepareRslSLABreach
   This script inserts a Event with 0 time to simulate an RslSLABreach
   --------------------------------------------------------------------------------
*/
/* global Log, Timer, Event */

Log.info("Prepare Rsl SLA Breach Entered...");
// Start Timer for Rsl SLA (ei_rsl_sla_breach)
  Timer.start({
  eventName: 'ei_rsl_sla_breach',
  delayMs: 0
});

Log.info(Event);
Log.info("Prepare Rsl SLA Breach Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
