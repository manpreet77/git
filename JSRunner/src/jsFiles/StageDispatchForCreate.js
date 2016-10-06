/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.16
 Stage Dispatch for Create
 This action loads dispatch maps and prepares a queue of dispatchs to be sent
 Sorted by ascending order of send time
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer, Contact, Event */

Log.info("Stage Dispatch for Create Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context


var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse(Workflow.DispatchQueueStringify) : 'undefined');

if (DispatchQueue === 'undefined') {
    Log.info("Initializing DispatchQueue...");
    DispatchQueue = new Array();
}


//Do the time calcuation in case there was a delay due to nextAvailableATMSchedule during Create time
var BaseDispatchStartTimeAsDate = new Date(Workflow.InStartTime);
if (Workflow.delayGapinMinsDueToNextAvailableAtmSchedule !== 'undefined' && Workflow.delayGapinMinsDueToNextAvailableAtmSchedule !== null) {
    Log.info("Adding " + Workflow.delayGapinMinsDueToNextAvailableAtmSchedule + " in all timers due to Next Available ATM Schedule");
    BaseDispatchStartTimeAsDate = addMinutes(BaseDispatchStartTimeAsDate, +Workflow.delayGapinMinsDueToNextAvailableAtmSchedule);
} else if (Workflow.delayGapinMinsDueToNextAvailableUserSchedule !== 'undefined' && Workflow.delayGapinMinsDueToNextAvailableUserSchedule !== null) {
    Log.info("Adding " + Workflow.delayGapinMinsDueToNextAvailableUserSchedule + " in all timers due to Next Available User Schedule");
    BaseDispatchStartTimeAsDate = addMinutes(BaseDispatchStartTimeAsDate, +Workflow.delayGapinMinsDueToNextAvailableUserSchedule);
}


var dmaps = null;

Log.info("Loading Notifications for Create...");
Log.info("Args to QueryDispatchMaps: actionrule= " + Workflow.ArName + ", tenantid= " + Workflow.TenantId + ", Schedule= " + AtmSched + ", Lifecycle= " + Workflow.WfLifecycle);

var AtmSched = "BranchHours"; //default Atm Schedule

//Incident Time falls in one of the atm schedule
if (Workflow.InIsInATMBranchHours === "1") {
    AtmSched = 'BranchHours';
} else if (Workflow.InIsInATMAfterHours === "1") {
    AtmSched = 'AfterHours';
} else if (Workflow.InIsInATMOtherHours === "1") {
    AtmSched = 'OtherHours';
} else if (Workflow.InIsInATMOperHours === "1") {
    AtmSched = 'OperationalHours';
} else {
    Log.info("Staging dispatches for Create after waiting " + Event.delayMs);
    //in case of coming back after sleeping, set base DSPstarttime as current time
    BaseDispatchStartTimeAsDate = new Date();
    AtmSched = Workflow.InNextATMSchedAvailable;
    //TODO case 'PeakHours':
    //TODO case 'OffPeakHours':
}


var queryArResult = Contact.queryDispatchMapWithNextAvailableUser({
    actionRule: Workflow.ArName,
    tenantId: Workflow.TenantId,
    atmSchedule: AtmSched,
    lifecycle: Workflow.WfLifecycle
});

if (!queryArResult) {
    Log.info("No contacts for dispatch were returned in QueryResult for Create ");
} else {
    Log.info("QueryResult Ack: " + JSON.stringify(queryArResult));
    var createDmaps = queryArResult.partyDetails;
    if (createDmaps) {
        Log.info("Dispatch Maps  size = " + createDmaps.length);
        for (var i = createDmaps.length - 1; i >= 0; i--) {
            if (createDmaps[i].contactType !== "Notification") {
                createDmaps.splice(i, 1);
            }
        }
    }
}

//for all other lifecycle events there is no need of ATM Schedule
// we will default to AnyHours in this case
AtmSched = "AnyHours";

Log.info("Loading pre breach reminders for Ack...");
Workflow.WfLifecycle = "Ack";
Log.info("Args to QueryDispatchMaps: actionrule= " + Workflow.ArName + ", tenantid= " + Workflow.TenantId + ", Schedule= " + AtmSched + ", Lifecycle= " + Workflow.WfLifecycle);

var queryArResult = Contact.queryDispatchMapWithNextAvailableUser({
    actionRule: Workflow.ArName,
    tenantId: Workflow.TenantId,
    atmSchedule: AtmSched,
    lifecycle: Workflow.WfLifecycle
});

if (!queryArResult) {
    Log.info("No contacts for dispatch were returned in QueryResult for Ack ");
} else {
    Log.info("QueryResult Ack: " + JSON.stringify(queryArResult));
    var ackDmaps = queryArResult.partyDetails;
    if (ackDmaps) {
        Log.info("Dispatch Maps  size = " + ackDmaps.length);
        for (var i = ackDmaps.length - 1; i >= 0; i--) {
            if (ackDmaps[i].contactType !== "Pre Breach Reminder") {
                ackDmaps.splice(i, 1);
            }
        }
    }

    Log.info("Loading pre breach reminders for Resolve...");
    Workflow.WfLifecycle = "Resolve";
    Log.info("Args to QueryDispatchMaps: actionrule= " + Workflow.ArName + ", tenantid= " + Workflow.TenantId + ", Schedule= " + AtmSched + ", Lifecycle= " + Workflow.WfLifecycle);

    queryArResult = Contact.queryDispatchMapWithNextAvailableUser({
        actionRule: Workflow.ArName,
        tenantId: Workflow.TenantId,
        atmSchedule: AtmSched,
        lifecycle: Workflow.WfLifecycle
    });

    Log.info("QueryResult Resolve: " + JSON.stringify(queryArResult));

    var resDmaps = queryArResult.partyDetails;
    if (resDmaps) {
        Log.info("Dispatch Maps  size = " + resDmaps.length);
        for (var i = resDmaps.length - 1; i >= 0; i--) {
            if (resDmaps[i].contactType !== "Pre Breach Reminder") {
                resDmaps.splice(i, 1);
            }
        }
    }

    dmaps = createDmaps.concat(ackDmaps, resDmaps);
}


if (dmaps) {

    Log.info("Dispatch Maps  size = " + dmaps.length);
    Log.info('Dispatch Maps Data :  {}', JSON.stringify(dmaps));
    Log.info("BaseDispatchstartTime = " + BaseDispatchStartTimeAsDate);
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
            if (Workflow.WfLifecycle === "Ack") {
                if (Workflow.ArAckSLA !== "undefined") {
                    DispatchStartTimeAsDate = addMinutes(BaseDispatchStartTimeAsDate, +Workflow.ArAckSLA - +dq.DelayMins);
                } else {
                    Log.info("Ack SLA is not defined, there will be no pre-breach reminder");
                    continue;
                }
            } else if (Workflow.WfLifecycle === "Resolve") {
                if (Workflow.ArRslSLA !== "undefined") {
                    DispatchStartTimeAsDate = addMinutes(BaseDispatchStartTimeAsDate, +Workflow.ArRslSLA - +dq.DelayMins);
                }
                else {
                    Log.info("Resolution SLA is not defined, there will be no pre-breach reminder");
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
                uu.Status = "new";
            }
        }
        
        
        var delayGapinMins = 0;
        if (processUserBlockForCalendar(dq)) {
            if (dq.nextAvailableTime) {

                Log.info("StageDispatchForAck: no current schedules found for the user, will have to sleep..");
                // Kick off the stage delay since no current schedules are there
                // Go to Sleep until next open time and come here instead of SendDispatch
                var currTime = new Date();
                Log.info('currTime: ' + currTime.toISOString());
                var goTime = new Date(Date.parse(dq.nextAvailableTime));
                Log.info('goTime: ' + goTime.toISOString());

                delayGapinMins = (goTime.getTime() - currTime.getTime()) / 60000;
                Log.info("Going to sleep due to user not available for " + delayGapinMins + " mins");

            }
            
            dq.TimerId = Timer.start({
                eventName: 'ei_stage_dispatch',
                delayMs: delayGapinMins * 60 * 1000
            });
            
            DispatchQueue.push(dq);
        }
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
//  Save the Queue away
Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
Log.info("DispatchQueue = {}", Workflow.DispatchQueueStringify);
Log.info("Stage Dispatch for Ack Exiting...");


function processUserBlockForCalendar(dq) {
    var result = false;
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

    for (var i in dq.users) {
        var user = dq.users[i];

        processForUserAddress(user);

        if (user.Status === "wait" || user.Status === "done")
            continue;


        if (user.isAvailable) {
            user.Status = "new";
            result = true;
        } else {
            if (dq.waitForNextContact) {
                dq.nextAvailableTime = user.nextAvailableTime;
                result = true;
                break;
            } else {
                user.Status = "new";
                result = true;
            }
        }
    }
    return result;
}


function processForUserAddress(user) {

    /* Address Processing for Emailid, PhoneNum..       
     * check if there is a comma, there can be 2 addresses for one user
     * */
    var addressString = user.address;
    if (!addressString) {
        Log.info("No Address provided for this contact record, skipping it..");
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


