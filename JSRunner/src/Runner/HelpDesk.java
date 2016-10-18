/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import java.io.IOException;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.slf4j.Logger;

/**
 *
 * @author Shridhar, Manpreet
 */
public class HelpDesk {

    private final Logger Log;

    public HelpDesk(Logger l) {
        this.Log = l;
    }

    /*SendActivity ( Workflow.InIncidentId,  /*OperationalType* /"ACTIVITY",  /*OperationalName* /"Email Notify",
                   /*Status* /null,             /*SubStatus* /null,
                   /*Category* /null,           /*SubCategory* /null,                /*ActivityTime* /null,
                   /*ExternalTicketId* /null,   /*ExternalTicketStatus* /null,       /*ExternalTicketSubStatus* /null,    /*ExternalCategory* /null,   /*ExternalSubCategory* /null,     
                   /*Result* /null,             /*ResultText* /null,                 /*Remarks* /null,                 
                   /*TargetParty* /null,        /*TargetPartyId* /null,              /*AdditionalInfo* /null);*/
    public void send(ScriptObjectMirror mirror) throws IOException {
        Log.info("Activity2IMS :: "
                + " / IncidentId = " + (String) mirror.get("incidentid")                
                + " / Status = " + (String) mirror.get("status")
                + " / SubStatus = " + (String) mirror.get("subStatus")
                + " / Category =  " + (String) mirror.get("category")
                + " / SubCategory = " + (String) mirror.get("subcategory")
                + " / ActivityTime = " + (String) mirror.get("activitytime")                
                + " / Result = " + (String) mirror.get("result")
                + " / ResultText = " + (String) mirror.get("resulttext")
                + " / Remarks = " + (String) mirror.get("remarks")                
        );        
    }
}
