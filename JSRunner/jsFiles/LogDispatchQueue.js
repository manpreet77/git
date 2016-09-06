/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   LogWorkflow
   Utility for designer to view current workflow values
   --------------------------------------------------------------------------------
*/
Log.info("Log DispatchQueue Entering................................................");
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');
Log.info ('EventType       SendTime                     DelayMins  Status  Channel ContactType     Level   AtmSchedule             FirstName   LastName    Address             FirstName2  LastName2   Address2            Content     Template        WillRespond     Ttl     MaxRetries  TryCount       ');
for (var i in DispatchQueue) {
    var dq = DispatchQueue[i];
    Log.info (dq.EventType     + "\t\t" +dq.SendTime      + "\t" +dq.DelayMins     + "\t" +dq.Status        + "\t" +dq.Channel       + "\t" +dq.ContactType   + "\t" +dq.Level+ "\t" +         dq.AtmSchedule+ "\t" +   dq.FirstName     + "\t" +dq.LastName      + "\t\t" +dq.Address       + "\t" +dq.FirstName2    + "\t\t" +dq.LastName2     + "\t\t" +dq.Address2      + "\t" +dq.Content       + "\t" +dq.Template      + "\t" +dq.WillRespond   + "\t\t\t\t" +dq.Ttl           + "\t" +dq.MaxRetries    + "\t\t\t" +dq.TryCount      );
}
Log.info("Log DispatchQueue Exitting ...............................................");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
