/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.32
 Send Error from Voice Adaptor
 This action checks reries and delays and requeues the dispatch if appropriate
 For Create it also queues the next contact to be contacted as needed
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, currdq, Event, Timer, helpdesk */

Log.info(Workflow.WfLogPrefix + "Send Error for Voice Entered...");


//Get details of the Event that resulted in this call
Log.info(Workflow.WfLogPrefix + "Error received in Voice call: Error = " + Event.adaperResponseStatus + ", Detail = " + Event.adaperResponseErrorText);

//  Restore DispatchQueue from Stringfy version in Workflow context

var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');

var dq;
var findNextUser = false;

for (var i in DispatchQueue) {
    var dq = DispatchQueue[i];
    if (dq.Channel.toLowerCase() === 'voice') {
        for (var j in dq.users) {
            var user = dq.users[j];

            if (user.Status === 'calling') {
                user.Status = 'error';
                var remarks = "Voice Dispatch could not be completed intended for User: '" + user.firstName + ' ' + user.lastName + "', Error: " + Event.adaperResponseStatus + ", Detail = " + Event.adaperResponseErrorText;
                Log.info(Workflow.WfLogPrefix + remarks);
                helpdesk.send({incidentid: Workflow.InIncidentId, category: "Error", subcategory: "User Not In Schedule", activitytime: new Date().toISOString(), result: "Failure", remarks: remarks, resulttext: ""});
                findNextUser = true;
                break;
            }
        }
        
        // Check if another user is configured (G Dispatch Block handling)
        var delayGapinMins = 0;
        if (findNextUser) {
            for (var j in dq.users) {
                var user = dq.users[j];

                if (user.Status === 'next') {
                    if (!user.isAvailable) {
                        if (user.nextAvailableTime) {
                            //deal with incompatible format coming from Contacts API                
                            if (user.nextAvailableTime.indexOf("+0000") > -1) {
                                user.nextAvailableTime = user.nextAvailableTime.replace("+0000", "Z");
                            }

                            Log.info(Workflow.WfLogPrefix + "StageDispatch: no current schedules found for the user, will have to sleep..");
                            // Kick off the stage delay since no current schedules are there
                            // Go to Sleep until next open time and come here instead of SendDispatch
                            var currTime = new Date();
                            Log.info(Workflow.WfLogPrefix + 'currTime: ' + currTime.toISOString());
                            var goTime = new Date(Date.parse(user.nextAvailableTime));
                            Log.info(Workflow.WfLogPrefix + 'goTime: ' + goTime.toISOString());

                            delayGapinMins += (goTime.getTime() - currTime.getTime()) / 60000;
                            Log.info(Workflow.WfLogPrefix + "Going to sleep due to user not available for " + delayGapinMins + " mins");
                        } else {
                            //no next available time exists for this user, so no dispatch will be done
                            //only log an activity in IMS
                            var remarks = "No Next Available schedules are configured for user: " + user.firstName + " " + user.lastName + " please check configuration!!";
                            Log.info(Workflow.WfLogPrefix + remarks);
                            helpdesk.send({incidentid: Workflow.InIncidentId, category: "Error", subcategory: "User Not In Schedule", activitytime: new Date().toISOString(), result: "Failure", remarks: remarks, resulttext: ""});
                            user.Status = 'done';
                            user.TimerId = null;
                            continue;
                        }
                    }

                    user.EventId = Date.now().toString();
                    user.Status = "new";
                    user.TimerId = Timer.start({
                        eventName: 'ei_send_dispatch',
                        delayMs: delayGapinMins * 60 * 1000,
                        properties: {'EventId': user.EventId, 'fromDispatchQueue': 'true'},
                        allowTimerWithSameName: 'true'
                    });
                }
            }
        }
    }
    break;
}

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
Log.info(Workflow.WfLogPrefix + "DispatchQueue = {}", Workflow.DispatchQueueStringify);
Log.info(Workflow.WfLogPrefix + "Send Error for Voice Exiting...");
//  --------------------------------------------------------------------------------
//  ESQ Management Solutions / ESQ Business Services
//  --------------------------------------------------------------------------------
