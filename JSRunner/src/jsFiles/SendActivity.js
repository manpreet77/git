/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.27
   SendActivity Function
   This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
*/

/* global Event, helpdesk */

function SendActivity ( IncidentId,    
                        Status, SubStatus,
                        Category,       SubCategory,    ActivityTime,   ExternalTicketId,
                        ExternalTicketStatus,           ExternalTicketSubStatus, 
                        ExternalCategory,               ExternalSubCategory,     
                        Result,         ResultText,     Remarks,                 
                        TargetParty,    TargetPartyId,  Addit)
{
    var activity = {
        incidentid                  : IncidentId              ,        
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






