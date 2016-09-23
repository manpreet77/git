/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.12
 EventArrSLABreach
 This script inserts a TimerEvent with 0 time to simulate an AckSLABreach
 --------------------------------------------------------------------------------
 */
/* global Log, Timer */

Log.info("Event Arr SLA Breach Entered...");
// Start Timer for Arr SLA (ei_arr_sla_breach)
Timer.start({
    eventName: 'ei_arr_sla_breach',
    delayMs: 0
});


Log.info("Event Arr SLA Breach Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
