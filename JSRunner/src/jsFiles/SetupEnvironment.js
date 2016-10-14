/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.33
   SetupEnvironment
   This action defines all globals and is included in initial rule of a workflow.
    --------------------------------------------------------------------------------
 */
/* global Log, Workflow */

Log.info("Setup Environment Entered...");

// Tenant Details
Workflow.TenantId                           ='undefined';   // Tenant Id of the ATM being dispatched
Workflow.TenantCode                         ='undefined';   // The Tenant short name (eg: ATB)
Workflow.TenantName                         ='undefined';   // The Name of the Root Organization
//  Workflow Details
Workflow.WfLifecycle                        ='undefined';   // The state of the work (create,ack....)
Workflow.WfStatus                           ='undefined';   // The state of the work (active, acked...)
Workflow.WfId                               ='undefined';   // The Dispatchers Workflow Instance Id
Workflow.WfStartTime                        ='undefined';   // When this Workflow started
Workflow.delayGapinMinsDueToNextAvailableAtmSchedule = 'undefined'; //used for finding out delay in case next atm schedule kicks in 
Workflow.delayGapinMinsDueToNextAvailableUserSchedule = 'undefined'; //used for finding out delay in case next atm schedule kicks in 
Workflow.PrimaryAssignedUser                = 'undefined';
Workflow.WfLogPrefix                        = '';
// Incident Details
Workflow.InIncidentId                       ='undefined';
Workflow.InPolicyName                       ='undefined';
Workflow.InTermId                           ='undefined';
Workflow.InSiteId                           ='undefined';
Workflow.InIncidentType                     ='undefined';
Workflow.InIsLinked                         ='undefined';
Workflow.InParentIncident                   ='undefined';
Workflow.InCategory                         ='undefined';
Workflow.InSubCategory                      ='undefined';
Workflow.InSubSubCategory                   ='undefined';
Workflow.InStatus                           ='undefined';
Workflow.InSubStatus                        ='undefined';
Workflow.InAssigneeParty                    ='undefined';
Workflow.InPartyId                          ='undefined';
Workflow.InStartTime                        ='undefined';
Workflow.InIsInATMBranchHours               ='undefined';
Workflow.InIsInATMAfterHours                ='undefined';
Workflow.InIsInATMOperationalHours          ='undefined';
Workflow.InIsInATMOtherHours                ='undefined';
Workflow.InIsInATMPeakHours                 ='undefined';
Workflow.InIsInATMOffPeakHours              ='undefined';
Workflow.InNextATMSchedAvailable            ='undefined';
Workflow.InNextATMSchedAvailableTime        ='undefined';


//  Fault Details   
Workflow.FltFaults                          ='undefined';
Workflow.FltMstatus                         ='undefined';
Workflow.FltMdata                           ='undefined';
Workflow.FltModule                          ='undefined';
Workflow.FltChronic                         ='undefined';
//  ATM Details
Workflow.AtmMake                            ='undefined';
Workflow.AtmID                              ='undefined';
Workflow.AtmOpHrs                           ='undefined';
Workflow.AtmBrnHrs                          ='undefined';
Workflow.AtmOffHrs                          ='undefined';
Workflow.AtmPeakHrs                         ='undefined';
Workflow.AtmOffPeakHrs                      ='undefined';
Workflow.AtmModel                           ='undefined';
Workflow.AtmMake                            ='undefined';
Workflow.AtmType                            ='undefined';
Workflow.AtmState                           ='undefined';
Workflow.AtmSubState                        ='undefined';
Workflow.AtmRegion                          ='undefined';
Workflow.AtmDistrict                        ='undefined';
Workflow.AtmBranch                          ='undefined';
Workflow.AtmNotes                           ='undefined';
Workflow.AtmOffSite                         ='undefined';
// Action 
Workflow.ArName                             ='undefined';   // Action Rule Name
Workflow.ArAtmSelector                      ='undefined';   // The Atm Expression
Workflow.ArVendorId                         ='undefined';   // Vendor or Dept Id default assignee
Workflow.ArVendorName                       ='undefined';   // Name of the Organization
Workflow.ArAckSLA                           ='undefined';   // Default SLA for ack for this ActionRule
Workflow.ArArrSLA                           ='undefined';   // Default SLA for arr for this ActionRule
Workflow.ArWorkSLA                          ='undefined';   // Default SLA for wrk for this ActionRule
Workflow.ArRslSLA                           ='undefined';   // Default SLA for rsl for this ActionRule
// Dispatch Map Array
Workflow.DispatchQueueStringify             ='undefined';   // Stringify Version of the Dispatch Queue

Log.info("Setup Environment Exiting...");
// --------------------------------------------------------------------------------
// ESQ Management Solutions / ESQ Business Services
// --------------------------------------------------------------------------------






