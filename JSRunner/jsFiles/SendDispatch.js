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

var dq, delayMins, currChannel;
var sentAnyDispatch; 

//  See if the Incident is in suitable state
if (Workflow.WfStatus != 'null' && Workflow.WfStatus !='') {
    
    for (var i in DispatchQueue) {

        //  dequeue next email to be sent
        dq = DispatchQueue[i];
        //check if this notification has already been processed
        if (dq.Status === 'done')
            continue;

        Log.info('Dispatch Data:(' + i + ') delayMs: ' + dq.DelayMins + ' Status: ' + dq.Status);
        
        var currTime = new Date();
        Log.info('currTime: ' + currTime.toISOString());
        var goTime   = new Date(Date.parse(dq.SendTime));
        Log.info('goTime: ' + goTime.toISOString());
        if (dq.Status == 'new' || dq.Status == 'retry') {
            if (goTime > currTime) {
                //set Timer for next notification
                Log.info("Setting the next timer for = {} mins", dq.DelayMins);
                Timer.start('ei_send_dispatch', dq.DelayMins*60*1000 );
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
                //TODO
                //var EmailTemplate = Contact.replaceVariables(dq.Template, {Workflow: Workflow});
                /*email.send( {to: dq.Address, subject: EmailTemplate.subject, body: EmailTemplate.body, htmlEmail: "true" } );*/
                Log.info('Dispatch: Channel = ' + dq.Channel + ', Type = ' + dq.ContactType + ', Level= '+ dq.Level +', AtmSchedule = '+dq.AtmSchedule +', FirstName = '+dq.FirstName+', LastName = '+dq.LastName+', Address = '+dq.Address);
                /*SendActivity (  Workflow.InIncidentId,  /*OperationalType* /"ACTIVITY",  /*OperationalName* /"Email Notify",
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
                Log.info('Dispatch: Channel = ' + dq.Channel + ', Type = ' + dq.ContactType + ', Level= '+ dq.Level +', AtmSchedule = '+dq.AtmSchedule +', FirstName = '+dq.FirstName+', LastName = '+dq.LastName+', Address = '+dq.Address);
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
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------