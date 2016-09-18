/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.3
 SendDispatch
 This action is initially triggered by the ei_send_dispatch event
 Sends all notifications whose send time is now or earlier
 If there are any more that require a delay it starts a Timer
 This action can also be triggered by ei_call_voice_error
 TBD
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer, Contact, email, voxeo, Event, helpdesk */

Log.info("Send Dispatch Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = JSON.parse(Workflow.DispatchQueueStringify);


Log.info('EventType       SendTime                     DelayMins  Status  Channel ContactType      AtmSchedule             WillRespond     Ttl     MaxRetries     FirstName   LastName    Address        Address2        Template         ');
for (var i in DispatchQueue) {
    var dq = DispatchQueue[i];
    for (var j in dq.users) {
        var user = dq.users[j];
        Log.info(dq.EventType + "\t\t" + dq.SendTime + "\t" + dq.DelayMins + "\t" + user.Status + "\t" + dq.Channel + "\t" + dq.ContactType + "\t" + dq.AtmSchedule + "\t" + dq.WillRespond + "\t\t" + dq.Ttl + "\t" + dq.MaxRetries + "\t\t" + user.firstName + " " + user.lastName + " " + user.Address + "\t\t" + user.Address2 + "\t\t" + dq.Template);
    }
}


var dq, delayMins, currChannel;

//  See if the Incident is in suitable state
if (Workflow.WfStatus !== 'undefined' && Workflow.WfStatus !== '') {

    for (var i in DispatchQueue) {

        //  dequeue next dispatch to be sent
        dq = DispatchQueue[i];

        for (var j in dq.users) {
            
            var user = dq.users[j];

            //check if this notification has already been processed
            if (user.Status === 'done')
                continue;

            Log.info('Dispatch Data:(' + i + ') delayMins: ' + dq.DelayMins + ' Status: ' + user.Status);

            var currTime = new Date();
            Log.info('currTime: ' + currTime.toISOString());
            var goTime = new Date(Date.parse(dq.SendTime));
            Log.info('goTime: ' + goTime.toISOString());

            if (user.Status === 'new' || user.Status === 'retry') {
                if (goTime > currTime) {
                    //set Timer for next notification
                    Log.info("Setting the next timer for = {} mins", dq.DelayMins);
                    Timer.start({
                        eventName: 'ei_send_dispatch',
                        delayMs: dq.DelayMins * 60 * 1000
                    });
                    user.Status = 'wait';
                    break;
                }
            } else if (user.Status !== 'wait') {
                break;
            }
            // All new with 0 delay and waits

            //  actually send to the adaptor
            currChannel = dq.Channel.toLowerCase();
            switch (currChannel)
            {
                case 'email':
                {
                    Contact.replaceVariables(dq.Template, {Workflow: Workflow});
                    email.send({to: user.Address, subject: dq.Template.subject, body: dq.Template.body, htmlEmail: "true"});
                    Log.info('Dispatch: Channel = ' + dq.Channel + ', Type = ' + dq.ContactType + ', AtmSchedule = ' + dq.AtmSchedule + ', FirstName = ' + user.firstName + ', LastName = ' + user.lastName + ', Address = ' + user.Address);
                    helpdesk.send({incidentid: Workflow.InIncidentId, operationtype: "ACTIVITY", operationame: "Email", category: "Contact", subcategory: "EMAIL", activitytime: new Date().toISOString(), result: "Success", remarks: "Notification via Email", resulttext: ""});
                    user.Status = 'done';
                    break;
                }
                case 'sms' :
                {
                    break;
                }
                case 'voice' :
                {
                    Contact.replaceVariables(dq.Template, {Workflow: Workflow});
                    voxeo.call({
                        //destinationNumber: "sip:linphone@192.168.1.90:5060",
                        destinationNumber: user.Address,
                        dialogId: "dispatchNotification/dispatchInfo.vxml",
                        retries: "2",
                        report: "true",
                        responseProperties: {
                            //"terminal id":Workflow.InTermId,
                            terminalId: Workflow.InTermId,
                            IncidentId: Workflow.InIncidentId

                        },
                        content: {
                            objectId: Workflow.InIncidentId,
                            reason: "Technical Help Required for Policy, " + Workflow.InPolicyName,
                            incidentId: Workflow.InIncidentId,
                            note: "",
                            terminalId: Workflow.InTermId,
                            eta: false,
                            lang: "en-US"
                        }
                    });

                    dq.Status = 'calling';
                    Log.info('Dispatch: Channel = ' + dq.Channel + ', Type = ' + dq.ContactType + ', AtmSchedule = ' + dq.AtmSchedule + ', FirstName = ' + user.FirstName + ', LastName = ' + user.LastName + ', Address = ' + user.Address);
                    helpdesk.send({incidentid: Workflow.InIncidentId, operationtype: "ACTIVITY", operationame: "Voice", category: "Contact", subcategory: "TELEPHONE", activitytime: new Date().toISOString(), result: user.Status, remarks: "Notification via Voice", resulttext: ""});

                    break;
                }
                case 'edi' :
                {
                    break;
                }
                default :
                {
                    Log.Info("Default Hit in Channel");
                }
            }
        }
    }

    //  Save the Queue away
    Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
}
Log.info("Send Dispatch Exiting...");

/* --------------------------------------------------------------------------------
 SendActivity Function
 This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
 */
function SendActivity(IncidentId, OperationType, OperationName,
        Status, SubStatus,
        Category, SubCategory, ActivityTime, ExternalTicketId,
        ExternalTicketStatus, ExternalTicketSubStatus,
        ExternalCategory, ExternalSubCategory,
        Result, ResultText, Remarks,
        TargetParty, TargetPartyId)
{
    var activity = {
        incidentid: IncidentId,
        operationtype: OperationType,
        operationame: OperationName,
        status: Status,
        substatus: SubStatus,
        category: Category,
        subcategory: SubCategory,
        activitytime: ActivityTime,
        externalticketid: ExternalTicketId,
        externalticketstatus: ExternalTicketStatus,
        externalticketsubstatus: ExternalTicketSubStatus,
        externalcategory: ExternalCategory,
        externalsubcategory: ExternalSubCategory,
        result: Result,
        resulttext: ResultText,
        remarks: Remarks,
        targetparty: TargetParty,
        targetpartyid: TargetPartyId,
        additionalInfo: {}
    };
    for (var i in Event)
        activity.additionalInfo[i] = Event[i];
    helpdesk.send(activity);
}
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
