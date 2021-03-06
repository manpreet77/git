/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.38
 Send Error from Voice Adaptor
 This action checks reries and delays and requeues the dispatch if appropriate
 For Create it also queues the next contact to be contacted as needed
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, currdq, Timer */

Log.info(Workflow.WfLogPrefix + "Send Ack for Voice Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');

var currdq;
delayMs = 0;

for (var i in DispatchQueue) {
    var dq = DispatchQueue[i];
    if (currdq.Status === 'calling' & currdq.Channel === 'voice') {
        break;
    }
}
//if (!dq.length) { break; } TODO
DispatchQueue[i].pop;
//  Sort the Queue by sendtime
//  Sort the Queue by sendtime
DispatchQueue.sort(function (a, b) {
    if (a.SendTime > b.SendTime)
        return 1;
    if (a.SendTime < b.SendTime)
        return -1;
    return 0;
});


//  Save the Queue away
Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);

Log.debug(Workflow.WfLogPrefix + "DispatchQueue = {}", Workflow.DispatchQueueStringify);


var EventId = Date.now().toString();
var TimerId = Timer.start({
    eventName: 'ei_send_dispatch',
    delayMs: 0,
    properties: {'EventId': EventId, 'name': 'SendVoiceDone'},
    allowTimerWithSameName: 'true'
});

Log.info(Workflow.WfLogPrefix + "Send Error for Voice Exiting...");
//  --------------------------------------------------------------------------------
//  ESQ Management Solutions / ESQ Business Services
//  --------------------------------------------------------------------------------
