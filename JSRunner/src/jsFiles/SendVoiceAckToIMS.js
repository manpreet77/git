/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.35
   SendActivity Function
   This action sends Ack Activity to IMS
 --------------------------------------------------------------------------------
*/
/* global Log, Workflow, helpdesk */

Log.info(Workflow.WfLogPrefix + "Received Ack from Voice, calling Send Ack Activity to IMS......"); 


Workflow.ackTime = new Date().toISOString();

helpdesk.send({incidentid:Workflow.InIncidentId, status: "OPEN", substatus:"ACKNOWLEDGE", category: "Incident Status",subcategory:"Update", activitytime: Workflow.ackTime, result : "Success", resulttext: "", remarks : "Recevied Ack via Voice"});
helpdesk.send({incidentid:Workflow.InIncidentId, category: "Assign",subcategory:"User", activitytime: Workflow.ackTime, assigneduser : Workflow.PrimaryAssignedUser, result : "Success", resulttext: "", remarks : "Assignment done to the User: " + Workflow.PrimaryAssignedUser});
                

Log.info(Workflow.WfLogPrefix + "Ack sent to IMS");


