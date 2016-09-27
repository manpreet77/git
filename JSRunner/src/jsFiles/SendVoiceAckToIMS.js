/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 2.8.7.14
   SendActivity Function
   This action sends Ack Activity to IMS
 --------------------------------------------------------------------------------
*/
/* global Log, Workflow, helpdesk */

Log.info("Received Ack from Voice, calling Send Ack Activity to IMS......"); 

Workflow.ackTime = new Date().toISOString();

helpdesk.send({incidentid:Workflow.InIncidentId, operationtype:"ACTIVITY", operationame: "ADD", status: "OPEN", substatus:"ACKNOWLEDGE", category: "Incident Status",subcategory:"Update", activitytime: Workflow.ackTime, result : "Success", resulttext: "", remarks : "Recevied Ack via Voice"});
                
Log.info("Ack sent to IMS");


