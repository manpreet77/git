/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   PrepareAckSLABreach
   This script inserts a TimerEvent with 0 time to simulate an AckSLABreach
   --------------------------------------------------------------------------------
*/
Log.info("Prepare Ack SLA Breach Entered...");
// Start Timer for Ack SLA (ei_ack_sla_breach)
Timer.start({
  eventName: 'ei_ack_sla_breach',
  delayMs: 0
});

Log.info(Event);
Log.info("Prepare Ack SLA Breach Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
