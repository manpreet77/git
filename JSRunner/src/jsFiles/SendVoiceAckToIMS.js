/* --------------------------------------------------------------------------------
   ESQ Management Solutions / ESQ Business Services
   --------------------------------------------------------------------------------
   Dispatcher Standard Workflow V 1.0
   SendActivity Function
   This action sends Ack Activity to IMS
 --------------------------------------------------------------------------------
*/
Log.info("Received Ack from Voice, calling Send Ack Activity to IMS......"); 

Workflow.ackTime = new Date().toISOString();
Workflow.InSubStatus='02';
Workflow.InStatus='01';
Workflow.WfLifecycle='ack';

helpdesk.send({incidentid:Workflow.InIncidentId, operationtype:"ACTIVITY", operationame: "ADD", status: "OPEN", substatus:"ACKNOWLEDGE", category: "Incident Status",subcategory:"Update", activitytime: Workflow.ackTime, result : "Success", resulttext: "", remarks : "Recevied Ack via Voice"});
                
Log.info("Ack sent to HD Service");


