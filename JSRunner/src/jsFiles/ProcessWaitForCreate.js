/*  --------------------------------------------------------------------------------
 ESQ Management Solutions / ESQ Business Services
 --------------------------------------------------------------------------------
 Dispatcher Standard Workflow V 2.8.7.30
 Process Wait for Create
 Find out if there is an initial wait at Incident Creation
 This can be due to ATM schedule or User schedule   
 --------------------------------------------------------------------------------
 */
/* global Log, Workflow, Timer, Contact, helpdesk */

Log.info("Process Wait for Create Entered...");

if (Workflow.InIsInATMBranchHours === "0" &&
        Workflow.InIsInATMAfterHours === "0" &&
        Workflow.InIsInATMOtherHours === "0" &&
        Workflow.InIsInATMOperationalHours === "0" &&
        Workflow.InNextATMSchedAvailableTime === null) {

    //there is no ATM schedule defined for this atm
    Log.info("ProcessWaitForCreate: No schedules are configured for this atm, please check configuration!!");
    helpdesk.send({incidentid: Workflow.InIncidentId, category: "Error", subcategory: "Terminal Not In Schedule", activitytime: new Date().toISOString(), result: "Failure", remarks: "No schedules are configured for this atm, please check configuration!!", resulttext: ""});
    Workflow.ATMScheduleConfigError = true;
} else {
    var delayGapinMins = 0;
    var AtmSched = "BranchHours";

//check for atmschedules: either current time falls in one of the atmschedules or not
//in case it does not, sleep till next available time
    if (Workflow.InIsInATMBranchHours === "0" &&
            Workflow.InIsInATMAfterHours === "0" &&
            Workflow.InIsInATMOtherHours === "0" &&
            Workflow.InIsInATMOperationalHours === "0" &&
            Workflow.InNextATMSchedAvailableTime !== null) {

        Log.info("ProcessWaitForCreate: no current schedules found, will have to sleep..");
        //  Kick off the stage delay since no current schedules are there
        // Go to Sleep until next open time and come here instead of SendDispatch
        var currTime = new Date();
        Log.info('currTime: ' + currTime.toISOString());
        var goTime = new Date(Date.parse(Workflow.InNextATMSchedAvailableTime));
        Log.info('goTime: ' + goTime.toISOString());
        delayGapinMins = (goTime.getTime() - currTime.getTime()) / 60000;

        Workflow.delayGapinMinsDueToNextAvailableAtmSchedule = delayGapinMins;
        AtmSched = Workflow.InNextATMSchedAvailable;

        Log.info("Going to sleep for " + delayGapinMins + " mins");
    } else {
        //Incident Time falls in one of the atm schedule
        if (Workflow.InIsInATMBranchHours === "1") {
            AtmSched = 'BranchHours';
        } else if (Workflow.InIsInATMAfterHours === "1") {
            AtmSched = 'AfterHours';
        } else if (Workflow.InIsInATMOtherHours === "1") {
            AtmSched = 'OtherHours';
        } else if (Workflow.InIsInATMOperHours === "1") {
            AtmSched = 'OperationalHours';
        } else {

            //TODO case 'PeakHours':
            //TODO case 'OffPeakHours':
        }
    }
    
    //call the StageDispatchForCreate with wait or no wait
    var EventId = Date.now().toString();
    Timer.start({
        eventName: 'ei_stage_dispatch_create',
        delayMs: delayGapinMins * 60 * 100,
        properties: {"EventId" : EventId, "AtmSched" : AtmSched}
    });
}

Log.info("Process Wait For Create Exiting...");

/* --------------------------------------------------------------------------------
 addMinutes Function
 Add minutes to a JS Date object
 --------------------------------------------------------------------------------
 */
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

//  --------------------------------------------------------------------------------
//  ESQ Management Solutions / ESQ Business Services
//  --------------------------------------------------------------------------------


