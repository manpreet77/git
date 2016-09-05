/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   PrepareWorkForCreate
   This action sets the stage and decides what needs to be done in this workflow
   --------------------------------------------------------------------------------
*/
Log.info("Prepare Work for Create Entered...");
// Housekeeping

// Duplicate check for ee_incident_create

// Copy Incident details from Event into Workflow like CreateTime, ATMHour, DefaultAssignedParty...
// Tenant DetailsWorkflow.IncidentId=Event.incidentid;
Workflow.TenantId                           =   Event.tenantid; 
Workflow.TenantCode                         =   //Event.TenantCode; does not come//
Workflow.TenantName                         =   Event.TenantName;
//  Workflow DetailsWorkflow.IncidentType=Event.incidenttype;
Workflow.WfStatus                           =   'new';
Workflow.WfLifeCycle                        =   'create';
Workflow.WfId                               =   'undefined';
Workflow.WfStartTime                        =   new Date ().toISOString();
// Incident Details
Workflow.ATMMake                            =   Event.atmmake;
Workflow.InIncidentId                       =   Event.incidentid;
Workflow.InStartTime                        =   Event.starttime;
Workflow.InPolicyName                       =   Event.policyname;
Workflow.InTermId                           =   Event.assetid;
Workflow.InSiteId                           =   Event.siteid;
Workflow.InIncidentType                     =   Event.incidenttype;
Workflow.InIsLinked                         =   Event.islinked
Workflow.InParentIncident                   =   'undefined';  
Workflow.InCategory                         =   Event.policydetails1;
Workflow.InSubCategory                      =   Event.policydetails2;
Workflow.InSubSubCategory                   =   Event.policydetails3;
Workflow.InStatus                           =   'undefined';
Workflow.InSubStatus                        =   'undefined';
Workflow.InAssigneeParty                    =   Event.targetpartyid;
Workflow.InPartyId                          =   'undefined';
Workflow.InIsInATMBranchHours               =   Event.schedules_brhr;
Workflow.InIsInATMAfterHours                =   Event.schedules_afhr;
Workflow.InIsInATMOtherHours                =   Event.schedules_oper;
// Action Rule Details
Workflow.ArId                               =   Event.actionruleid;
Workflow.ArName                             =   Event.actionrulename;   // Action Rule Name
Workflow.ArServiceRole                      =   Event.policyrole;
Workflow.ArAtmSelector                      =   'undefined';            // The Atm Expression
Workflow.ArVendorId                         =   Event.targetpartyid;    // Vendor or Dept Id default assignee
Workflow.ArVendorName                       =   Event.targetparty;      // Name of the Organization
Workflow.ArAckSLA                           =   Event.slaacknowledge;   //Ack SLA
Workflow.ArArrSLA                           =   'undefined';            //Arrival SLA 
Workflow.ArWorkSLA                          =   'undefined';            //Work SLA       
Workflow.ArRslSLA                           =   Event.slaresolve;       //Resolve SLA   

// Copy ATM details from Event into  Workflow

// Copy Fault details from Event into Workflow

// Copy Incident Stats into Workflow

// Set WorkFlow State
Workflow.WfLifecycle = 'create';
Workflow.WfStatus = 'new';
// Start Timer for Ack SLA (ei_ack_sla_timeout)
if(Workflow.ArAckSLA > 0)  { Timer.start('ei_ack_sla_breach', Workflow.ArAckSLA*60*1000 ); }
// Start Timer for Resolve SLA (ei_rsl_sla_timeout)
if(Workflow.ArRslSLA > 0)  { Timer.start('ei_rsl_sla_breach', Workflow.ArAckSLA*60*1000 ); }

//Log.info(Event);
Log.info("Prepare Work for Create Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------
