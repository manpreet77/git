/*  --------------------------------------------------------------------------------
    ESQ Management Solutions / ESQ Business Services
    --------------------------------------------------------------------------------
    Dispatcher Standard Workflow V 1.0
    StageDispatchs
    This action loads dispatch maps and prepares a queue of dispatchs to be sent
    Sorted by ascending order of send time
    Then it emits an event with a 0 delay to kickoff the send email loop
    --------------------------------------------------------------------------------
*/
Log.info("Stage Dispatch Entered...");
//  Restore DispatchQueue from Stringfy version in Workflow context

var DispatchQueue = (Workflow.DispatchQueueStringify !== 'undefined' ? JSON.parse (Workflow.DispatchQueueStringify): 'undefined');

//  Get duration, template, schedule, party
//  Load DispatchMaps
if  (DispatchQueue === 'undefined') {
    Log.info("Initializing DispatchQueue...");
    DispatchQueue = new Array();
    
    //var dmaps = Contact.queryActionRule({arName: Workflow.ArName,tenantId: Workflow.TenantId, wfLifecyle : Workflow.WfLifecycle, /*channel : 'Email' */});
       
    var dmaps  =[{
                        "user":{
                                        "firstName":"Rajiv",
                                        "lastName":"Beri",
                                        "address":"rajiv.beri@esq.com"
                                },
                        "lifeCycle":"Create",
                        "contactType":"Notification",
                        "level":"Base",
                        "contactChannel":"Email",
                        "atmSchedule":"OperationalHours",
                        "duration":{
                                                        "name":"some system generated name",
                                                        "baseValueMinutes":0,
                                                        "graceValueMinutes":0
                                                },
                        "template": {
                                                        "name":"Notification Email Template",
                                                        "description":"Email Template for tenants",
                                                        "templateType":"email",
                                                        "subject":"Incident Alert Notification - Incident Id: %Workflow.IncidentId% - ATM ID:SITE ID = %Workflow.TermId%:%Workflow.SiteId% - 		%Workflow.Category%.%Workflow.Sub_Category%.%Workflow.Sub_Sub_Category%",
                                                        "body":"The problem \\n%Workflow.Category%.%Workflow.Sub_Category%.%Workflow.Sub_Sub_Category% occurred on ATM ID:SITE ID = %Workflow.TermId%:%Workflow.SiteId% with Incident Id = %Workflow.IncidentId%.\\n<br>\\nPlease resolve the incident with in defined SLA %Workflow.TimeBefore1Escalation% Hours in order to avoid escalation.\\n</br>\\n<br><br><b>\\nThis is an auto-generated email. Please do not reply or write back to this Email ID. \\n</b></br></br>\\n\\n"
                                                }
                },
                {
                        "user":{
                                        "firstName":"Manpreet",
                                        "lastName":"Singh",
                                        "address":"ms@esq.com"
                                },
                        "lifeCycle":"Create",
                        "contactType":"Escalation",
                        "level":"Level-1",
                        "contactChannel":"Email",
                        "atmSchedule":"OperationalHours",
                        "duration":{
                                                        "name":"some system generated name",
                                                        "baseValueMinutes":3,
                                                        "graceValueMinutes":0
                                                },
                        "template": {
                                                        "name":"Level-1 Email Template",
                                                        "description":"L1-Email Template for tenants",
                                                        "templateType":"email",
                                                        "subject":"Escalation level L1 - Incident Id: %Workflow.IncidentId% - ATM ID:SITE ID = %Workflow.TermId%:%Workflow.SiteId%  - %Workflow.Category%.%Workflow.Sub_Category%.%Workflow.Sub_Sub_Category%",
                                                        "body":"Due to non - resolution of the  Incident Id: \\n%Workflow.IncidentId% - %Workflow.Category%.%Workflow.Sub_Category%.%Workflow.Sub_Sub_Category% for the ATM ID:SITE ID = %Workflow.TermId%:%Workflow.SiteId%, It has been escalated to Level L1. <br>Please resolve the incident in order to avoid further escalation</br> \\n      \\n<br><b>This is an auto-generated email. Please do not reply or write back to this Email ID.</b></br>\\n"
                                                }
                }					
        ];	
    
        Log.info("Dispatch maps - dmaps size ={}" + dmaps.length);
        
        for (var i in dmaps) {
        var dq = {};
        /* Create, Ack...            */ dq.EventType     = dmaps[i].lifeCycle;
        var sendTime = new Date(Date.parse(Workflow.InStartTime));
        var sendTime2 = sendTime.setMinutes(sendTime.getMinutes() + dmaps[i].duration.baseValueMinutes);
        /* When to be sent           */ dq.SendTime      = new Date(sendTime2).toISOString();
        /* delay duration            */ dq.DelayMins     = dmaps[i].duration.baseValueMinutes;
        /* wait, done, retry, error  */ dq.Status        = 'new';
        /* Email, SMS...             */ dq.Channel       = dmaps[i].contactChannel;
        /* Notification, Escalation  */ dq.ContactType   = dmaps[i].contactType;
        /* Base, Level-1...          */ dq.Level         = dmaps[i].level;
        /* OperationalHours...       */ dq.AtmSchedule   = dmaps[i].atmSchedule;
        /* FN of the person          */ dq.FirstName     = dmaps[i].user.firstName;
        /* LN of the person          */ dq.LastName      = dmaps[i].user.lastName;
        /* Emailid, PhoneNum..       */ dq.Address       = dmaps[i].user.address;
        /* Data to be sent           */ dq.Content       = 'undefined';
        /* Template for adaptor      */ dq.Template      = dmaps[i].template;
        /* If response can come      */ dq.WillRespond   = 'yes';
        /* Time To Live              */ dq.Ttl           = 3600;
        /* Max Retries to be done    */ dq.MaxRetries    = 0;
        /* Num of tries so far       */ dq.TryCount      = 0;
        DispatchQueue.push(dq);
    }
}
//  Call global function for atmScheduleHandling

//  Sort the Queue by sendtime
DispatchQueue.sort  ( function(a, b) { if ( a.SendTime > b.SendTime ) return 1; return 0; } );

//  Save the Queue away
Workflow.DispatchQueueStringify = JSON.stringify (DispatchQueue);

Log.info("DispatchQueue = {}", Workflow.DispatchQueueStringify);

//  Kick off the sending of notifications
Timer.start('ei_send_dispatch', 0);

Log.info("Stage Dispatch Exiting...");
//  --------------------------------------------------------------------------------
//  ESQ Management Solutions / ESQ Business Services
//  --------------------------------------------------------------------------------
