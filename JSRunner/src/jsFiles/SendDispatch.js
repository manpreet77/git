/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 SendDispatch
 This action is initially triggered by the ei_send_notifications event
 Sends all notifications whose send time is now or earlier
 If there are any more that require a delay it starts a Timer
 This action can also be triggered by ei_call_voice_error
 TBD
 --------------------------------------------------------------------------------
 */
Log.info("Send Dispatch Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context
var DispatchQueue = JSON.parse(Workflow.DispatchQueueStringify);

    
Log.info('EventType       SendTime                     DelayMins  Status  Channel ContactType     Level   AtmSchedule             WillRespond     Ttl     MaxRetries  TryCount    FirstName   LastName    Address         FirstName2  LastName2   Address2        Content         Template         ');
for (var i in DispatchQueue) {
    var dq = DispatchQueue[i];
    Log.info(dq.EventType + "\t\t" + dq.SendTime + "\t" + dq.DelayMins + "\t" + dq.Status + "\t" + dq.Channel + "\t" + dq.ContactType + "\t" + dq.Level + "\t" + dq.AtmSchedule + "\t" + dq.WillRespond + "\t\t" + dq.Ttl + "\t" + dq.MaxRetries + "\t\t" + dq.TryCount + "\t" + dq.FirstName + " " + dq.LastName + " " + dq.Address + "\t\t" + dq.FirstName2 + " " + dq.LastName2 + " " + dq.Address2 + "\t\t" + dq.Content + "\t" + dq.Template);
}


var dq, delayMins, currChannel;
var sentAnyDispatch;

//  See if the Incident is in suitable state
if (Workflow.WfStatus != 'null' && Workflow.WfStatus != '') {

    for (var i in DispatchQueue) {

        //  dequeue next email to be sent
        dq = DispatchQueue[i];
        //check if this notification has already been processed
        if (dq.Status === 'done')
            continue;

        Log.info('Dispatch Data:(' + i + ') delayMins: ' + dq.DelayMins + ' Status: ' + dq.Status);

        var currTime = new Date();
        Log.info('currTime: ' + currTime.toISOString());
        var goTime = new Date(Date.parse(dq.SendTime));
        Log.info('goTime: ' + goTime.toISOString());

        if (dq.Status == 'new' || dq.Status == 'retry' || dq.Status == 'defer') {
            if (goTime > currTime) {
                //set Timer for next notification
                Log.info("Setting the next timer for = {} mins", dq.DelayMins);
                Timer.start({
                    eventName: 'ei_ack_sla_breach',
                    delayMs: dq.DelayMins * 60 * 1000
                });
                dq.Status = 'wait';
                break;
            }
        } else if (dq.Status != 'wait') {
            break;
        }
        // All new with 0 delay and waits

        //  actually send to the adaptor
        currChannel = dq.Channel.toLowerCase();
        switch (currChannel)
        {
            case 'email':
            {
                EmailTemplate = Contact.replaceVariables({template: dq.Template, Workflow: Workflow});
                email.send({to: dq.Address, subject: EmailTemplate.subject, body: EmailTemplate.body, htmlEmail: "true"});
                Log.info('Dispatch: Channel = ' + dq.Channel + ', Type = ' + dq.ContactType + ', Level= ' + dq.Level + ', AtmSchedule = ' + dq.AtmSchedule + ', FirstName = ' + dq.FirstName + ', LastName = ' + dq.LastName + ', Address = ' + dq.Address);
                /*SendActivity ( Workflow.InIncidentId,  /*OperationalType* /"ACTIVITY",  /*OperationalName* /"Email Notify",
                 /*Status* /null,             /*SubStatus* /null,
                 /*Category* /null,           /*SubCategory* /null,                /*ActivityTime* /null,
                 /*ExternalTicketId* /null,   /*ExternalTicketStatus* /null,       /*ExternalTicketSubStatus* /null,    /*ExternalCategory* /null,   /*ExternalSubCategory* /null,     
                 /*Result* /null,             /*ResultText* /null,                 /*Remarks* /null,                 
                 /*TargetParty* /null,        /*TargetPartyId* /null,              /*AdditionalInfo* /null);*/
                dq.Status = 'done';
                break;
            }
            case 'sms' :
            {
                break;
            }
            case 'voice' :
            {
                //var VoiceTemplate = Contact.replaceVariables(dq.Template, {Workflow: Workflow});
                /*voice.send( { to: dq.Address, subject: EmailTemplate.subject, body: EmailTemplate.body, htmlEmail: "true" } );*/
                Log.info('Dispatch: Channel = ' + dq.Channel + ', Type = ' + dq.ContactType + ', Level= ' + dq.Level + ', AtmSchedule = ' + dq.AtmSchedule + ', FirstName = ' + dq.FirstName + ', LastName = ' + dq.LastName + ', Address = ' + dq.Address);
                /*SendActivity (  Workflow.InIncidentId,  /*OperationalType* /"ACTIVITY",  /*OperationalName* /"Email Notify",
                 /*Status* /null,             /*SubStatus* /null,
                 /*Category* /null,           /*SubCategory* /null,                /*ActivityTime* /null,
                 /*ExternalTicketId* /null,   /*ExternalTicketStatus* /null,       /*ExternalTicketSubStatus* /null,    /*ExternalCategory* /null,   /*ExternalSubCategory* /null,     
                 /*Result* /null,             /*ResultText* /null,                 /*Remarks* /null,                 
                 /*TargetParty* /null,        /*TargetPartyId* /null,              /*AdditionalInfo* /null);*/
                dq.Status = 'calling';
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
    
    //  Save the Queue away
    Workflow.DispatchQueueStringify = JSON.stringify(DispatchQueue);
}
Log.info("Send Dispatch Exiting...");

/* --------------------------------------------------------------------------------
   SendActivity Function
   This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
*/
function SendActivity ( IncidentId,     OperationType,  OperationName,
                        Status, SubStatus,
                        Category,       SubCategory,    ActivityTime,   ExternalTicketId,
                        ExternalTicketStatus,           ExternalTicketSubStatus, 
                        ExternalCategory,               ExternalSubCategory,     
                        Result,         ResultText,     Remarks,                 
                        TargetParty,    TargetPartyId,  Addit)
{
    var activity = {
        incidentid                  : IncidentId              ,
        operationtype               : OperationType           ,
        operationame                : OperationName           ,
        status                      : Status                  ,
        substatus                   : SubStatus               ,
        category                    : Category                ,
        subcategory                 : SubCategory             ,
        activitytime                : ActivityTime            ,
        externalticketid            : ExternalTicketId        ,
        externalticketstatus        : ExternalTicketStatus    ,
        externalticketsubstatus     : ExternalTicketSubStatus ,
        externalcategory            : ExternalCategory        ,
        externalsubcategory         : ExternalSubCategory     ,
        result                      : Result                  ,
        resulttext                  : ResultText              ,
        remarks                     : Remarks                 ,
        targetparty                 : TargetParty             ,
        targetpartyid               : TargetPartyId           ,
        additionalInfo              : ""
    };
    for (var i in Event) activity.additionalInfo[i] = Event[i];
        helpdesk.send(activity);
}
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------



// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------