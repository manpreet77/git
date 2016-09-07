/*  --------------------------------------------------------------------------------
    ESQ Management Solutions / ESQ Business Services
    --------------------------------------------------------------------------------
    Dispatcher Standard Workflow V 1.0
    Send Error from Voice Adaptor
    This action checks reries and delays and requeues the dispatch if appropriate
    For Create it also queues the next contact to be contacted as needed
    --------------------------------------------------------------------------------
*/
Log.info("Send Error for Voice Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context

var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');

var dq; delayMs = 0;

for (var i in DispatchQueue) {
    var dq = DispatchQueue[i];
    if (currdq.Status == 'calling' & currdq.Channel == 'voice') { break; }
    } 
//if (!dq.length) { break; } TODO

dq.TryCount++;
if (dq.MaxRetries > dq.TryCount) {   
    // retry
    dq.Status = 'retry';
} else {
// Retries are over, now check if another user is configured (Gasper Dispatch Block handling)
   
   
   dq.Status = 'new';
} 

//  Sort the Queue by sendtime
DispatchQueue.sort  ( function(a, b) { if ( a.SendTime > b.SendTime ) return 1; return 0; } );

//  Save the Queue away
Workflow.DispatchQueueStringify = JSON.stringify (DispatchQueue);

Log.info("DispatchQueue = {}", Workflow.DispatchQueueStringify);

//  Kick off the sending of notifications
Timer.create('ei_send_dispatch', 0);

Log.info("Send Error for Voice Exiting...");
//  --------------------------------------------------------------------------------
//  ESQ Management Solutions / ESQ Business Services
//  --------------------------------------------------------------------------------
