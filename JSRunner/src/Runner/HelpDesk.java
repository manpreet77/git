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
 * @author Shridhar
 */
public class HelpDesk {

    private Logger Log;

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
                + " / IncidentId = " + (String) mirror.get("IncidentId)")
                + " / OperationalType = " + (String) mirror.get("OperationalType")
                + " / OperationalName = " + (String) mirror.get("OperationalName")
                + " / Status = " + (String) mirror.get("Status")
                + " / SubStatus = " + (String) mirror.get("SubStatus")
                + " / Category =  " + (String) mirror.get("Category")
                + " / SubCategory = " + (String) mirror.get("SubCategory")
                + " / ActivityTime = " + (String) mirror.get("ActivityTime")
                + " / ExternalTicketId = " + (String) mirror.get("ExternalTicketId")
                + " / ExternalTicketStatus = " + (String) mirror.get("ExternalTicketStatus")
                + " / ExternalTicketSubStatus =" + (String) mirror.get("ExternalTicketSubStatus")
                + " / ExternalCategory = " + (String) mirror.get("ExternalCategory")
                + " / ExternalSubCategory = " + (String) mirror.get("ExternalSubCategory")
                + " / Result = " + (String) mirror.get("Result")
                + " / ResultText = " + (String) mirror.get("ResultText")
                + " / Remarks = " + (String) mirror.get("Remarks")
                + " / TargetParty = " + (String) mirror.get("TargetParty")
                + " / TargetPartyId = " + (String) mirror.get("TargetPartyId")
        );
        return;
        //return content;
    }
}
