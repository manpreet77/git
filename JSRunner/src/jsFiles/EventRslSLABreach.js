/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.6
 EventRslSLABreach
 This script inserts a TimerEvent with 0 time to simulate an RslSLABreach
 --------------------------------------------------------------------------------
 */
/* global Log, Timer */

Log.info("Event Rsl SLA Breach Entered...");
// Start Timer for Rsl SLA (ei_rsl_sla_breach)
Timer.start({
    eventName: 'ei_rsl_sla_breach',
    delayMs: 0
});
Log.info("Event Rsl SLA Breach Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
