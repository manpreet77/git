/* --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.27
 PrepareWorkForCreate
 This action sets the stage and decides what needs to be done in this workflow
 --------------------------------------------------------------------------------
 */
/* global Workflow, Event, Log, Timer */

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
Workflow.InIsLinked = Event.islinked;
Workflow.InParentIncident = 'undefined';
Workflow.InCategory = Event.policydetails1;
Workflow.InSubCategory = Event.policydetails2;
Workflow.InSubSubCategory = Event.policydetails3;
Workflow.InStatus = 'undefined';
Workflow.InSubStatus = 'undefined';
Workflow.InAssigneeParty = Event.targetpartyid;
Workflow.InPartyId = 'undefined';
Workflow.InIsInATMBranchHours = Event.schedules_branchhours; // 1 or 0
Workflow.InIsInATMAfterHours = Event.schedules_afterhours; // 1 or 0
Workflow.InIsInATMOperationalHours = Event.schedules_operationalhours; // 1 or 0
Workflow.InIsInATMOtherHours = Event.schedules_otherhours; // 1 or 0
Workflow.InIsInATMPeakHours = Event.schedules_peakhours; // 1 or 0
Workflow.InIsInATMOffPeakHours = Event.schedules_offpeakhours; // 1 or 0
Workflow.InNextATMSchedAvailable = Event.schedulesnext_categoryname;  // Name: BranchHours, AfterHours, OtherHours, OperationalHours, PeakHours,OffPeakHours  etc.
Workflow.InNextATMSchedAvailableTime = Event.schedulesnext_nextavailableschedulestarttime; //next avl time - e.g. 2016-08-30T00:00:00

// Action Rule Details
Workflow.ArId = Event.actionruleid;
Workflow.ArName = Event.actionrulename;   // Action Rule Name
Workflow.ArServiceRole = Event.policyrole;
Workflow.ArAtmSelector = 'undefined';         // The Atm Expression
Workflow.ArVendorId = Event.targetpartyid;    // Vendor or Dept Id default assignee
Workflow.ArVendorName = Event.targetparty;      // Name of the Organization
if (Event.slaacknowledgeenabled === "1") {
        Workflow.ArAckSLA = Event.slaacknowledge;       //Ack SLA
}
if (Event.slaarrivalenabled === "1") {
    Workflow.ArArrSLA = Event.slaarrivalminutes;  //Arrival SLA 
}

if (Event.slaresolveenabled === "1") {
    Workflow.ArRslSLA = Event.slaresolve;       //Resolve SLA  
}
Workflow.ArWorkSLA = 'undefined';            //Work SLA - not implemented       


// Copy ATM details from Event into  Workflow
Workflow.AtmMake = Event.atmmake;

// Copy Fault details from Event into Workflow

// Copy Incident Stats into Workflow

// Set WorkFlow State
//  Workflow Details
Workflow.WfStatus = 'new';
Workflow.WfLifecycle = 'Create';
Workflow.WfId = 'undefined';
Workflow.WfStartTime = new Date().toISOString();
Log.info("Workflow.WfStartTime:" + Workflow.WfStartTime);


Log.info("Prepare Work for Create Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
