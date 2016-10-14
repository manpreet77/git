/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.33
 Stage Dispatch for Create
 This action loads dispatch maps and prepares a queue of dispatchs to be sent
 Sorted by ascending order of send time
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer, Contact, Event, helpdesk */

Log.info(Workflow.WfLogPrefix + Workflow.WfLogPrefix + "Stage Dispatch for Create Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context


var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');

if (DispatchQueue === 'undefined') {
    Log.info(Workflow.WfLogPrefix + Workflow.WfLogPrefix + "Initializing DispatchQueue...");
    DispatchQueue = new Array();
}

//Get details of the Event that resulted in this call
if (Event !== 'undefined' && Event !== null && Event.EventId !== null) {
    Log.info(Workflow.WfLogPrefix + "Source Timer Event: " + Event.EventId);
}

//Do the time calcuation in case there was a delay due to nextAvailableATMSchedule during Create time
var BaseDispatchStartTimeAsDate = new Date(Workflow.InStartTime);
if (Workflow.delayGapinMinsDueToNextAvailableAtmSchedule !== 'undefined' && Workflow.delayGapinMinsDueToNextAvailableAtmSchedule !== null) {
    Log.info(Workflow.WfLogPrefix + "Adding " + Workflow.delayGapinMinsDueToNextAvailableAtmSchedule + " in all timers due to Next Available ATM Schedule");
    BaseDispatchStartTimeAsDate = addMinutes(BaseDispatchStartTimeAsDate, +Workflow.delayGapinMinsDueToNextAvailableAtmSchedule);
}

//Start the SLA Breach timers
// Start Timer for Ack SLA (ei_ack_sla_breach)
if (Workflow.ArAckSLA !== 'undefined' && Workflow.ArAckSLA > 0) {
    Log.info(Workflow.WfLogPrefix + 'Start Ack SLA Breach Timer');
    Timer.start({
        eventName: 'ei_ack_sla_breach',
        delayMs: Workflow.ArAckSLA * 60 * 1000
    });
}


// Start Timer for Resolve SLA (ei_rsl_sla_breach)
if (Workflow.ArRslSLA !== 'undefined' && Workflow.ArRslSLA > 0) {
    Log.info(Workflow.WfLogPrefix + 'Start Resolution SLA Breach Timer');
    Timer.start({
        eventName: 'ei_rsl_sla_breach',
        delayMs: Workflow.ArRslSLA * 60 * 1000
    });
}

var dmaps = null;


var AtmSched = Event.AtmSched;


Log.info(Workflow.WfLogPrefix + "Loading Notifications for Create...");
Log.info(Workflow.WfLogPrefix + "Args to QueryDispatchMaps: actionrule= " + Workflow.ArName + ", tenantid= " + Workflow.TenantId + ", Schedule= " + AtmSched + ", Lifecycle= " + Workflow.WfLifecycle);

var queryArResult = Contact.queryDispatchMapWithNextAvailableUser({
    actionRule: Workflow.ArName,
    tenantId: Workflow.TenantId,
    atmSchedule: AtmSched,
    lifecycle: Workflow.WfLifecycle,
    additionalFilter: {branch: Workflow.AtmBranch}
});

if (!queryArResult) {
    var remarks = "No contacts for dispatch are configured for Incident Create lifeCyle, no dispatch will take place,  please check configuration!!";
    Log.info(Workflow.WfLogPrefix + remarks);
    helpdesk.send({incidentid: Workflow.InIncidentId, category: "Error", subcategory: "User Not In Schedule", activitytime: new Date().toISOString(), result: "Failure", remarks: remarks, resulttext: ""});
} else {
    Log.info(Workflow.WfLogPrefix + "QueryResult Create: " + JSON.stringify(queryArResult));
    var createDmaps = queryArResult.partyDetails;
    if (createDmaps) {
        Log.info(Workflow.WfLogPrefix + "Dispatch Maps  size = " + createDmaps.length);
        for (var i = createDmaps.length - 1; i >= 0; i--) {
            if (createDmaps[i].contactType !== "Notification") {
                createDmaps.splice(i, 1);
            }
        }
    }


    //for all other lifecycle events there is no need of ATM Schedule
    // we will default to AnyHours in this case
    AtmSched = "AnyHours";

    Log.info(Workflow.WfLogPrefix + "Loading pre breach reminders for Ack...");
    Workflow.WfLifecycle = "Ack";
    Log.info(Workflow.WfLogPrefix + "Args to QueryDispatchMaps: actionrule= " + Workflow.ArName + ", tenantid= " + Workflow.TenantId + ", Schedule= " + AtmSched + ", Lifecycle= " + Workflow.WfLifecycle);

    var queryArResult = Contact.queryDispatchMapWithNextAvailableUser({
        actionRule: Workflow.ArName,
        tenantId: Workflow.TenantId,
        atmSchedule: AtmSched,
        lifecycle: Workflow.WfLifecycle,
        additionalFilter: {branch: Workflow.AtmBranch}
    });

    if (!queryArResult) {
        Log.info(Workflow.WfLogPrefix + "No contacts for dispatch were returned in QueryResult for Ack ");
    } else {
        Log.info(Workflow.WfLogPrefix + "QueryResult Ack: " + JSON.stringify(queryArResult));
        var ackDmaps = queryArResult.partyDetails;
        if (ackDmaps) {
            Log.info(Workflow.WfLogPrefix + "Dispatch Maps  size = " + ackDmaps.length);
            for (var i = ackDmaps.length - 1; i >= 0; i--) {
                if (ackDmaps[i].contactType !== "Pre Breach Reminder") {
                    ackDmaps.splice(i, 1);
                }
            }
        }

        Log.info(Workflow.WfLogPrefix + "Loading pre breach reminders for Resolve...");
        Workflow.WfLifecycle = "Resolve";
        Log.info(Workflow.WfLogPrefix + "Args to QueryDispatchMaps: actionrule= " + Workflow.ArName + ", tenantid= " + Workflow.TenantId + ", Schedule= " + AtmSched + ", Lifecycle= " + Workflow.WfLifecycle);

        queryArResult = Contact.queryDispatchMapWithNextAvailableUser({
            actionRule: Workflow.ArName,
            tenantId: Workflow.TenantId,
            atmSchedule: AtmSched,
            lifecycle: Workflow.WfLifecycle,
            additionalFilter: {branch: Workflow.AtmBranch}
        });

        Log.info(Workflow.WfLogPrefix + "QueryResult Resolve: " + JSON.stringify(queryArResult));

        var resDmaps = queryArResult.partyDetails;
        if (resDmaps) {
            Log.info(Workflow.WfLogPrefix + "Dispatch Maps  size = " + resDmaps.length);
            for (var i = resDmaps.length - 1; i >= 0; i--) {
                if (resDmaps[i].contactType !== "Pre Breach Reminder") {
                    resDmaps.splice(i, 1);
                }
            }
        }

        dmaps = createDmaps;

        if (ackDmaps) {
            dmaps = createDmaps.concat(ackDmaps);
        }

        if (resDmaps) {
            dmaps = dmaps.concat(resDmaps);
        }
    }


    if (dmaps) {

        Log.info(Workflow.WfLogPrefix + "Dispatch Maps  size = " + dmaps.length);
        Log.info(Workflow.WfLogPrefix + 'Dispatch Maps Data :  {}', JSON.stringify(dmaps));
        Log.info(Workflow.WfLogPrefix + "BaseDispatchstartTime = " + BaseDispatchStartTimeAsDate);
        for (var i in dmaps) {
            var dq = {};
            /* Create, Ack...            */ dq.EventType = dmaps[i].lifeCycle;
            /* Email, SMS...             */ dq.Channel = dmaps[i].contactChannel;
            /* Notification, Escalation  */ dq.ContactType = dmaps[i].contactType;
            /* OperationalHours...       */ dq.AtmSchedule = dmaps[i].atmSchedule;
            /* delay duration            */ dq.DelayMins = parseInt(dmaps[i].duration.baseValueMinutes, 10);

            //handling of SendTime and delay based on ContactType
            var DispatchStartTimeAsDate = new Date(BaseDispatchStartTimeAsDate);
            if (dq.ContactType === "Pre Breach Reminder") {
                //special handling of Pre-breach type 
                //in this case the duration has to be subtracted from the SLA and accordingly adjusted
                if (dq.EventType === "Ack") {
                    if (Workflow.ArAckSLA !== "undefined") {
                        DispatchStartTimeAsDate = addMinutes(BaseDispatchStartTimeAsDate, +Workflow.ArAckSLA - +dq.DelayMins);
                    } else {
                        Log.info(Workflow.WfLogPrefix + "Ack SLA is not defined, there will be no pre-breach reminder");
                        continue;
                    }
                } else if (dq.EventType === "Resolve") {
                    if (Workflow.ArRslSLA !== "undefined") {
                        DispatchStartTimeAsDate = addMinutes(BaseDispatchStartTimeAsDate, +Workflow.ArRslSLA - +dq.DelayMins);
                    }
                    else {
                        Log.info(Workflow.WfLogPrefix + "Resolution SLA is not defined, there will be no pre-breach reminder");
                        continue;
                    }
                }
            }
            else if (dq.ContactType === "Notification") {
                //for notifications duration needs to be added to basetime
                DispatchStartTimeAsDate = addMinutes(BaseDispatchStartTimeAsDate, +dq.DelayMins);
            }


            /* When to be sent           */
            dq.SendTime = DispatchStartTimeAsDate.toISOString();
            /* unique id for all contacts belonging in this record*/
            dq.contactMapping = dmaps[i].contactMapping;

            /* if we have to wait for next contact or continue with next*/
            dq.waitForNextContact = dmaps[i].waitForNextContact;


            /* Template Type */
            dq.TemplateType = dmaps[i].template.templateType;
            /* Template for adaptor      */
            if (!dmaps[i].template.jsonDefinition) {
                dq.Template = '';
            } else {
                dq.Template = JSON.parse(dmaps[i].template.jsonDefinition);
            }

            /* If response can come      */
            if (dq.Channel === 'Voice' || dq.Channel === 'NCR-EDI' || dq.Channel === 'DECAL')
                dq.WillRespond = 'yes';
            else
                dq.WillRespond = 'no';

            if (dq.TemplateType === 'other') {
                //template body has JSON for all the properties needed by this dispatch
                //stored in the template
                if (!dq.Template.body) {
                    dq.Template = '';
                } else {
                    dq.Template.body = JSON.parse(dq.Template.body);
                }

                /* Time To Live */
                if (dq.Template.body.Ttl) {
                    dq.Ttl = dq.Template.body.Ttl;
                } else {
                    dq.Ttl = 3600;
                }

                /* Max Retries to be done */
                if (dq.Template.body.MaxRetries) {
                    dq.MaxRetries = dq.Template.body.MaxRetries;
                } else {
                    dq.MaxRetries = 0;
                }
            }


            /* copy the contacts array into dq and add a new Status variable*/
            if (!dq.users) {
                dq.users = dmaps[i].users.slice();
                for (var x in dq.users) {
                    var uu = dq.users[x];
                    uu.Status = "next";
                }
            }

            //  Sort the user array by seqNo
            if (dq.users && dq.users.length > 0) {
                dq.users.sort(function (a, b) {
                    if (a.sequenceNo > b.sequenceNo)
                        return 1;
                    if (a.sequenceNo < b.sequenceNo)
                        return -1;
                    return 0;
                });
            }


            var delayGapinMins = (DispatchStartTimeAsDate.getTime() - Date.now()) / 60000;
            if (delayGapinMins < 0)
                delayGapinMins = 0;

            for (var i in dq.users) {
                var user = dq.users[i];

                processForUserAddress(user);

                if (user.Status === "wait" || user.Status === "done")
                    continue;


                if (!user.isAvailable) {
                    if (user.nextAvailableTime) {
                        user.Status = "new";
                        Log.info(Workflow.WfLogPrefix + "StageDispatchForCreate: no current schedules found for the user, will have to sleep..");
                        // Kick off the stage delay since no current schedules are there
                        // Go to Sleep until next open time and come here instead of SendDispatch
                        //deal with incompatible format coming from Contacts API                
                        if (user.nextAvailableTime.indexOf("+0000") > -1) {
                            user.nextAvailableTime = user.nextAvailableTime.replace("+0000", "Z");
                        }
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
                        user.EventId = null;
                        continue;
                    }
                }


                user.Status = "new";
                user.EventId = Date.now().toString();
                user.TimerId = Timer.start({
                    eventName: 'ei_send_dispatch',
                    delayMs: delayGapinMins * 60 * 1000,
                    properties: {'EventId': user.EventId, 'fromDispatchQueue': 'true'},
                    allowTimerWithSameName: 'true'
                });

                //if this was a notification, we only need to do one dispatch for a user per channel type unless there is an error 
                if (dq.ContactType === "Notification") {
                    //in case there was a delay added for initial dispatch, we will need to add this to all subsequent dispatches
                    if (delayGapinMins > 0) {
                        Workflow.delayGapinMinsDueToNextAvailableUserSchedule = delayGapinMins;
                    }
                    break;
                }

            }
            DispatchQueue.push(dq);
        }

        //  Sort the Queue by sendtime
        DispatchQueue.sort(function (a, b) {
            if (a.SendTime > b.SendTime)
                return 1;
            if (a.SendTime < b.SendTime)
                return -1;
            return 0;
        });

    }
}

//  Save the Queue away
Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
Log.info(Workflow.WfLogPrefix + "DispatchQueue = {}", Workflow.DispatchQueueStringify);
Log.info(Workflow.WfLogPrefix + "Stage Dispatch for Create Exiting...");


function processForUserAddress(user) {

    /* Address Processing for Emailid, PhoneNum..       
     * check if there is a comma, there can be 2 addresses for one user
     * */
    var addressString = user.address;
    if (!addressString) {
        Log.info(Workflow.WfLogPrefix + "No Address provided for this contact record, skipping it..");
        user.Status = "error";
    } else {
        //try splitting on comma
        var addrArray = addressString.split(',');
        user.Address = addrArray[0].trim();
        if (addrArray[1])
            user.Address2 = addrArray[1].trim();
    }
}

/* --------------------------------------------------------------------------------
 addMinutes Function
 Add minutes to a JS Date object
 --------------------------------------------------------------------------------
 */
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}



//  --------------------------------------------------------------------------------
//  ESQ Management Solutions / ESQ Business Services
//  --------------------------------------------------------------------------------


