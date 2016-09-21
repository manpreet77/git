/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.8
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
    for (var j in dq.users){
        var user = dq.users[j];
        Log.info(dq.EventType + "\t\t" + dq.SendTime + "\t" + dq.DelayMins + "\t" + user.Status + "\t" + dq.Channel + "\t" + dq.ContactType + "\t" +  dq.AtmSchedule + "\t" + dq.WillRespond + "\t\t" + dq.Ttl + "\t" + dq.MaxRetries + "\t\t" + user.firstName + " " + user.lastName + " " + user.Address + "\t\t" + user.Address2 + "\t\t" +  dq.Template);
    }
}
Log.info("Log DispatchQueue Exitting ...............................................");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
