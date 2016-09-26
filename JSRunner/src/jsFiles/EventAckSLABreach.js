/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.13
 EventAckSLABreach
 This script inserts a TimerEvent with 0 time to simulate an AckSLABreach
 --------------------------------------------------------------------------------
 */
/* global Log, Timer */

Log.info("Event Ack SLA Breach Entered...");
//Start Timer for Ack SLA (ei_ack_sla_breach)
Timer.start({
    eventName: 'ei_ack_sla_breach',
    delayMs: 0
});

Log.info("Event Ack SLA Breach Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
