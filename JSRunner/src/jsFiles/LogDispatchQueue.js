/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 LogWorkflow
 Utility for designer to view current workflow values
 --------------------------------------------------------------------------------
 */

/* global Log, Workflow */

Log.info("Log DispatchQueue Entering................................................");
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');
Log.info('EventType       SendTime                     DelayMins  Status  Channel ContactType      AtmSchedule             WillRespond     Ttl     MaxRetries     FirstName   LastName    Address        Address2        Template         ');
for (var i in DispatchQueue) {
    var dq = DispatchQueue[i];
    Log.info(dq.EventType + "\t\t" + dq.SendTime + "\t" + dq.DelayMins + "\t" + dq.Status + "\t" + dq.Channel + "\t" + dq.ContactType + "\t" +  dq.AtmSchedule + "\t" + dq.WillRespond + "\t\t" + dq.Ttl + "\t" + dq.MaxRetries + "\t\t" + dq.FirstName + " " + dq.LastName + " " + dq.Address + "\t\t" + dq.Address2 + "\t\t" +  dq.Template);
}
Log.info("Log DispatchQueue Exitting ...............................................");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
