/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.36
 SendDispatch
 This action is initially triggered by the ei_send_dispatch event
 Sends all notifications whose send time is now or earlier
  --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer, Contact, email, voxeo, Event, helpdesk */

Log.info(Workflow.WfLogPrefix + "Send Dispatch Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context

//Get details of the Event that resulted in this call
if (Event !== 'undefined' && Event !== null && Event.EventId !== null) {
    Log.info(Workflow.WfLogPrefix + "Source Timer Event: " +  Event.EventId);
}



var DispatchQueue = JSON.parse(Workflow.DispatchQueueStringify);


Log.info(Workflow.WfLogPrefix + 'EventType       SendTime                     DelayMins  Status  Channel ContactType      AtmSchedule             WillRespond     Ttl     MaxRetries     FirstName   LastName    Address        Address2');
for (var i in DispatchQueue) {
    var dq = DispatchQueue[i];
    for (var j in dq.users) {
        var user = dq.users[j];

        Log.info(Workflow.WfLogPrefix + dq.EventType + "\t\t" + (user.isAvailable === true ? dq.SendTime : user.nextAvailableTime) + "\t" + dq.DelayMins + "\t" + user.Status + "\t" + dq.Channel + "\t" + dq.ContactType + "\t" + dq.AtmSchedule + "\t" + dq.WillRespond + "\t\t" + dq.Ttl + "\t" + dq.MaxRetries + "\t\t" + user.firstName + " " + user.lastName + " " + user.Address + "\t\t" + user.Address2);
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

                    Log.info(Workflow.WfLogPrefix + 'Email Dispatch: LifeCycle = ' + dq.EventType + ', Channel = ' + dq.Channel + ', Type = ' + dq.ContactType + ', AtmSchedule = ' + dq.AtmSchedule + ', FirstName = ' + user.firstName + ', LastName = ' + user.lastName + ', Address = ' + user.Address);

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
                    
                    var CallOption = "";
                    if (dq.EventType === "Create") {
                        CallOption = "CreateIncident";                        
                        Note = "This is initial Notification";
                    } else if(dq.ContactType === "Pre Breach Reminder"){
                        CallOption = "PreBreachReminder";                        
                        Note = "This is reminder that SLA breach for " + dq.EventType + " will happen soon"; //TODO                       
                    } else if(dq.ContactType === "Breach"){
                        CallOption = "Breach";                                                
                        Note = dq.EventType + " SLA has been breached";                                            
                    } else if(dq.ContactType.indexOf("Escalation") > -1){
                        CallOption = "Escalation";   
                        if (dq.ContactType === "Escalation-L1"){
                            Note = "This is Level 1 Escalation for " + dq.EventType ;
                        }
                        else if (dq.ContactType === "Escalation-L2"){
                            Note = "This is Level 2 Escalation for " + dq.EventType ;
                        }
                        else if (dq.ContactType === "Escalation-L3"){
                            Note = "This is Level 3 Escalation for " + dq.EventType ;
                        }
                        else if (dq.ContactType === "Escalation-L4"){
                            Note = "This is Level 4 Escalation for " + dq.EventType ;
                        }
                    }
                    
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
                            reason:  Workflow.InPolicyName,
                            incidentId: Workflow.InIncidentId,
                            note: Note,
                            callOption: CallOption,
                            terminalId: Workflow.InTermId,
                            contactReference: "Manpreet",  //TODO
                            calledUser: user.firstName + ' ' + user.lastName,
                            eta:true,
                            lang:"en-US"                            
                        }
                    });

                    user.Status = 'calling';
                    if(user.userName){
                        Workflow.PrimaryAssignedUser = user.userName;
                    }
                    Log.info(Workflow.WfLogPrefix + 'Voice Dispatch: LifeCycle = ' + dq.EventType + ', Channel = ' + dq.Channel + ', Type = ' + dq.ContactType + ', AtmSchedule = ' + dq.AtmSchedule + ', FirstName = ' + user.firstName + ', LastName = ' + user.lastName + ', Address = ' + user.Address);
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
Log.info(Workflow.WfLogPrefix + "Send Dispatch Exiting...");

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

            if (user.EventId === id && user.Status === 'new') {
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
