/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   PrepareAckSLABreach
   This script inserts a TimerEvent with 0 time to simulate an AckSLABreach
   --------------------------------------------------------------------------------
*/
Log.info("Prepare Ack Entered...");
// Start Timer for Ack SLA (ei_ack_sla_breach)
// Check WorkFlow State. If !'active' then ignore.
// Set Variable WorkFlow.LifeCycle.State to 'acked'
if (Workflow.WfStatus == 'new' || Workflow.WfStatus == 'reopened' || Workflow.WfStatus == 'resumed') {
    Workflow.WfLifecycle = 'ack';
    Workflow.WfStatus = 'acked';
    Timer.cancel('ei_ack_sla_breach');
}
// Copy Ack details into WorkFlow [arrive time, arrive user]


Log.info(Event);
Log.info("Prepare Ack Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
