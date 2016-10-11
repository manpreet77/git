/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.29
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

//Get details of the Event that resulted in this call
if (Event !== 'undefined' && Event !== null && Event.EventId !== null) {
    Log.info("Source Timer Event: " +  Event.EventId);
}



var DispatchQueue = JSON.parse(Workflow.DispatchQueueStringify);


Log.info('EventType       SendTime                     DelayMins  Status  Channel ContactType      AtmSchedule             WillRespond     Ttl     MaxRetries     FirstName   LastName    Address        Address2');
for (var i in DispatchQueue) {
    var dq = DispatchQueue[i];
    for (var j in dq.users) {
        var user = dq.users[j];

        Log.info(dq.EventType + "\t\t" + (user.isAvailable === true ? dq.SendTime : user.nextAvailableTime) + "\t" + dq.DelayMins + "\t" + user.Status + "\t" + dq.Channel + "\t" + dq.ContactType + "\t" + dq.AtmSchedule + "\t" + dq.WillRespond + "\t\t" + dq.Ttl + "\t" + dq.MaxRetries + "\t\t" + user.firstName + " " + user.lastName + " " + user.Address + "\t\t" + user.Address2);
    }
}


var dq, delayMins, currChannel;

//  See if the Incident is in suitable state
if (Workflow.WfStatus !== 'undefined' && Workflow.WfStatus !== '') {

    //find dispatch record to be sent based on eventid received
    dq = findUserRecordFromDQ(Event.EventId);

    for (var j in dq.users) {

        var user = dq.users[j];

        if (user.EventId === Event.EventId)
        {
            //check if this notification has already been processed
            if (user.Status === 'done' || user.Status === 'canceled' || user.Status === 'next')
                continue;

            //  actually send to the adaptor
            currChannel = dq.Channel.toLowerCase();
            switch (currChannel)
            {
                case 'email':
                {
                    Contact.replaceVariables(dq.Template, {Workflow: Workflow});
                    email.send({to: user.Address, subject: dq.Template.subject, body: dq.Template.body, htmlEmail: "true"});

                    var category, subcategory, remarks;
                    if (dq.ContactType === "Notification") {
                        category = "Contact";
                        subcategory = "EMAIL";
                        remarks = "Notification via Email for '" + dq.EventType + "' sent to: " + userAddrInfo(user);
                    } else if (dq.ContactType === "Pre Breach Reminder") {
                        category = "Contact";
                        subcategory = "EMAIL";
                        remarks = "Pre Breach Reminder Notification via Email for: '" + dq.EventType + "' sent to: " + userAddrInfo(user);
                    } else if (dq.ContactType === "Breach") {
                        if (dq.EventType === 'Ack') {
                            category = "Ack SLA";
                        } else if (dq.EventType === 'Resolve') {
                            category = "SLA";
                        }
                        subcategory = "Breached";
                        remarks = "SLA Breach Notification via Email for: '" + dq.EventType + "' sent to: " + userAddrInfo(user);
                    } else {
                        category = "Escalate";
                        subcategory = "EMAIL";
                        if (dq.ContactType === "Escalation-L1")
                            remarks = "L1 Escalation via Email for: '" + dq.EventType + "' sent to: " + userAddrInfo(user);
                        else if (dq.ContactType === "Escalation-L2")
                            remarks = "L2 Escalation via Email for: '" + dq.EventType + "' sent to: " + userAddrInfo(user);
                        else if (dq.ContactType === "Escalation-L3")
                            remarks = "L3 Escalation via Email for: '" + dq.EventType + "' sent to: " + userAddrInfo(user);
                        else if (dq.ContactType === "Escalation-L4")
                            remarks = "L4 Escalation via Email for: '" + dq.EventType + "' sent to: " + userAddrInfo(user);
                    }

                    Log.info('Email Dispatch: LifeCycle = ' + dq.EventType + ', Channel = ' + dq.Channel + ', Type = ' + dq.ContactType + ', AtmSchedule = ' + dq.AtmSchedule + ', FirstName = ' + user.firstName + ', LastName = ' + user.lastName + ', Address = ' + user.Address);

                    helpdesk.send({incidentid: Workflow.InIncidentId, category: category, subcategory: subcategory, activitytime: new Date().toISOString(), result: "Success", remarks: remarks, resulttext: ""});
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
                        destinationNumber: user.Address,
                        dialogId: "dispatchNotification/dispatchInfo.vxml",
                        retries: "2",
                        report: "true",
                        responseProperties: {
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

                    user.Status = 'calling';
                    Log.info('Dispatch: LifeCycle = ' + dq.EventType + ', Channel = ' + dq.Channel + ', Type = ' + dq.ContactType + ', AtmSchedule = ' + dq.AtmSchedule + ', FirstName = ' + user.FirstName + ', LastName = ' + user.LastName + ', Address = ' + user.Address);
                    helpdesk.send({incidentid: Workflow.InIncidentId, category: "Contact", subcategory: "TELEPHONE", activitytime: new Date().toISOString(), result: user.Status, remarks: "Notification via Voice", resulttext: ""});
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
 addMinutes Function
 Add minutes to a JS Date object
 --------------------------------------------------------------------------------
 */
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

function userAddrInfo(u) {
    return "'" + u.firstName + " " + u.lastName + "(" + u.address + ")'";
}

function findUserRecordFromDQ(id) {
    var breakOut = false;
    var rec = null;
    for (var i in DispatchQueue) {
        rec = DispatchQueue[i];

        for (var j in rec.users) {

            var user = rec.users[j];

            if (user.EventId === id) {
                breakOut = true;
                break;
            }
        }
        if (breakOut)
            break;
    }
    return rec;
}

/* --------------------------------------------------------------------------------
 SendActivity Function
 This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
 */
function SendActivity(IncidentId,
        Status, SubStatus,
        Category, SubCategory, ActivityTime, ExternalTicketId,
        ExternalTicketStatus, ExternalTicketSubStatus,
        ExternalCategory, ExternalSubCategory,
        Result, ResultText, Remarks,
        TargetParty, TargetPartyId)
{
    var activity = {
        incidentid: IncidentId,
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
