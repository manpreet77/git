/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   EventArrSLABreach
   This script inserts a TimerEvent with 0 time to simulate an AckSLABreach
   --------------------------------------------------------------------------------
*/
Log.info("Event Arr SLA Breach Entered...");
// Start Timer for Ack SLA (ei_ack_sla_breach)
Timer.start('ei_arr_sla_breach', 0 );


Log.info("Event Arr SLA Breach Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
