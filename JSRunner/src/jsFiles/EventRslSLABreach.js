/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 EventRslSLABreach
 This script inserts a TimerEvent with 0 time to simulate an RslSLABreach
 --------------------------------------------------------------------------------
 */
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
