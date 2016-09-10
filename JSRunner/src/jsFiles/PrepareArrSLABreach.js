/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 PrepareArrSLABreach
 This script inserts a TimerEvent with 0 time to simulate an AckSLABreach
 --------------------------------------------------------------------------------
 */
/* global Log, Timer */

Log.info("Prepare Arr SLA Breach Entered...");
// Start Timer for Ack SLA (ei_ack_sla_breach)
Timer.start({
    eventName: 'ei_arr_sla_breach',
    delayMs: 0
});

Log.info("Prepare Arr SLA Breach Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
