/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 1.0
 PrepareWorkForCreate
 This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
 */
Log.info("Prepare Work for Create Entered...");

// Copy Incident details from Event into Workflow like CreateTime, ATMHour, DefaultAssignedParty...

Workflow.TenantId = Event.tenantid;
Workflow.TenantCode = 'undefined';//Event.TenantCode; does not come//
Workflow.TenantName = 'undefined';//Event.TenantName; does not come//
// Incident Details
Workflow.InIncidentId = Event.incidentid;
Workflow.InStartTime = Event.starttime;
Workflow.InPolicyName = Event.policyname;
Workflow.InTermId = Event.assetid;
Workflow.InSiteId = Event.siteid;
Workflow.InIncidentType = Event.incidenttype;
Workflow.InIsLinked = Event.islinked
Workflow.InParentIncident = 'undefined';
Workflow.InCategory = Event.policydetails1;
Workflow.InSubCategory = Event.policydetails2;
Workflow.InSubSubCategory = Event.policydetails3;
Workflow.InStatus = 'undefined';
Workflow.InSubStatus = 'undefined';
Workflow.InAssigneeParty = Event.targetpartyid;
Workflow.InPartyId = 'undefined';
Workflow.InIsInATMBranchHours = Event.schedules_brnchr; // 1 or 0
Workflow.InIsInATMAfterHours = Event.schedules_aftrhr; // 1 or 0
Workflow.InIsInATMOperHours = Event.schedules_operhr; // 1 or 0
Workflow.InIsInATMOtherHours = Event.schedules_othrhr; // 1 or 0
Workflow.InIsInATMPeakHours = Event.schedules_peakhr; // 1 or 0
Workflow.InIsInATMOffPeakHours = Event.schedules_ofpkhr; // 1 or 0
Workflow.InNextATMSchedAvailable= Event.schedulesnext_categorycode;  // any of OPERHR,BRNCHR,AFTRHR,OTHRHR,PEAKHR,OFPKHR
Workflow.InNextATMSchedAvailableTime= Event.schedulesnext_nextavailableschedulestarttime; //next avl time - e.g. 2016-08-30T00:00:00

// Action Rule Details
Workflow.ArId = Event.actionruleid;
Workflow.ArName = Event.actionrulename;   // Action Rule Name
Workflow.ArServiceRole = Event.policyrole;
Workflow.ArAtmSelector = 'undefined';            // The Atm Expression
Workflow.ArVendorId = Event.targetpartyid;    // Vendor or Dept Id default assignee
Workflow.ArVendorName = Event.targetparty;      // Name of the Organization
Workflow.ArAckSLA = Event.slaacknowledge;   //Ack SLA
Workflow.ArArrSLA = 'undefined';            //Arrival SLA 
Workflow.ArWorkSLA = 'undefined';            //Work SLA       
Workflow.ArRslSLA = Event.slaresolve;       //Resolve SLA   

// Copy ATM details from Event into  Workflow
Workflow.AtmMake = Event.atmmake;

// Copy Fault details from Event into Workflow

// Copy Incident Stats into Workflow

// Set WorkFlow State
//  Workflow Details
Workflow.WfStatus = 'new';
Workflow.WfLifeCycle = 'Create';
Workflow.WfId = 'undefined';
Workflow.WfStartTime = new Date().toISOString();

// Start Timer for Ack SLA (ei_ack_sla_breach)
if (Workflow.ArAckSLA > 0) {
    Log.info('Start Timer');
    Timer.start({
        eventName: 'ei_ack_sla_breach',
        delayMs: Workflow.ArAckSLA * 60 * 1000
    });
}
// Start Timer for Resolve SLA (ei_rsl_sla_breach)
if (Workflow.ArRslSLA > 0) {
    Timer.start({
        eventName: 'ei_rsl_sla_breach',
        delayMs: Workflow.ArRslSLA * 60 * 1000
    });
}

//Log.info(Event);
Log.info("Prepare Work for Create Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
