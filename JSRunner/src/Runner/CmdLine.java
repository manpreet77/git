/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import org.slf4j.Logger;

/**
 *
 * @author Shridhar
 */
public class CmdLine {

    JSRunner r;
    List ev;
    Timer t;
    Logger Log;

    public CmdLine(JSRunner r, List tl, Timer t, Logger l) {
        this.ev = tl;
        this.r = r;
        this.t = t;
        this.Log = l;
    }

    public void Loop() {

        Log.info(" ");
        Log.info("Welcome to ESQ Dispatcher Script Tool...V1.8.0");

        // Read input with BufferedReader.
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));

        while (true) {
            Log.info("Main Menu.......");
            Log.info("1  - Create");
            Log.info("2  - Ack");
            Log.info("3  - Ack Breach");
            Log.info("4  - ETA");
            Log.info("5  - Arrive");
            Log.info("6  - Hold");
            Log.info("7  - Resume");
            Log.info("8  - Resolve");
            Log.info("9  - Rsl Breach");
            Log.info("10 - Reopen");
            Log.info("11 - Close");
            Log.info("12 - SendVoiceDone");
            Log.info("13 - SendVoiceError");
            Log.info("0  - Process One Timer Event");
            Log.info("90 - Log the Workflow Object");
            Log.info("91 - Log the Event Object");
            Log.info("92 - Log All Timer Events in Queue");
            Log.info("93 - Log DispatchQueue");
            Log.info(" ");
            Log.info("Enter Choice: ");

            // Read line and try to call parseInt on it.
            String line = "";
            try {
                line = in.readLine();
            } catch (IOException ex) {
                Log.error(ex.getMessage());
            }
            int result = 0;
            try {
                result = Integer.parseInt(line);
            } catch (NumberFormatException ex) {
                Log.info("Quitting..............................................\n\n");
                System.exit(0);
            }

            // Handle user input in a switch case.
            switch (result) {

                case 1:
                    Log.info("Run EventCreate.js....................................");
                    r.RunJS("EventCreate.js");
                    Log.info("Run SetupEnvironment.js...............................");
                    r.RunJS("SetupEnvironment.js");
                    Log.info("Run PrepareCreate.js..................................");
                    r.RunJS("PrepareCreate.js");
                    Log.info("Run StageDispatch.js..................................");
                    r.RunJS("StageDispatch.js");
                    break;
                case 2:
                    Log.info("Run EventAck.js................   ....................");
                    r.RunJS("EventAck.js");
                    Log.info("Run PrepareAck.js.....................................");
                    r.RunJS("PrepareAck.js");
                    Log.info("Run StateDispatch.js..................................");
                    r.RunJS("StageDispatch.js");
                    break;
                case 3:
                    Log.info("Run EventAckSLABreach.js...............................");
                    r.RunJS("EventAckBreach.js");
                    Log.info("Run PrepareAckSLABreach.js...............................");
                    r.RunJS("PrepareAckBreach.js");
                    Log.info("Run StateDispatch.js..................................");
                    r.RunJS("StageDispatch.js");
                    break;
                case 4:
                    Log.info("Run EventETA.js...............................");
                    r.RunJS("EventETA.js");
                    Log.info("Run PrepareETA.js...............................");
                    r.RunJS("PrepareETA.js");
                    Log.info("Run StateDispatch.js..................................");
                    r.RunJS("StageDispatch.js");
                    break;
                case 5:
                    Log.info("Run EventArrive.js..................................");
                    r.RunJS("EventArrive.js");
                    Log.info("Run PrepareArrive.js..................................");
                    r.RunJS("PrepareArrive.js");
                    Log.info("Run StateDispatch.js..................................");
                    r.RunJS("StageDispatch.js");
                    break;
                case 6:
                    Log.info("Run EventHold.js..................................");
                    r.RunJS("EventHold.js");
                    Log.info("Run PrepareHold.js..................................");
                    r.RunJS("PrepareHold.js");
                    Log.info("Run StateDispatch.js..................................");
                    r.RunJS("StageDispatch.js");
                    break;
                case 7:
                    Log.info("Run EventResume.,.... ..............................");
                    r.RunJS("EventResume.js");
                    Log.info("Run PrepareResume.,.... ..............................");
                    r.RunJS("PrepareResume.js");
                    Log.info("Run StateDispatch.js..................................");
                    r.RunJS("StageDispatch.js");
                    break;
                case 8:
                    Log.info("Run EventResolve.js.................................");
                    r.RunJS("EventResolve.js");
                    Log.info("Run PrepareResolve.js.................................");
                    r.RunJS("PrepareResolve.js");
                    Log.info("Run StateDispatch.js..................................");
                    r.RunJS("StageDispatch.js");
                    break;
                case 9:
                    Log.info("Run EventRslSLABreach.js. .............................");
                    r.RunJS("EventRslSLABreach.js");
                    Log.info("Run PrepareRslSLABreach.js. .............................");
                    r.RunJS("PrepareRslSLABreach.js");
                    Log.info("Run StateDispatch.js..................................");
                    r.RunJS("StageDispatch.js");
                    break;
                case 10:
                    Log.info("Run EventReopen.js..................................");
                    r.RunJS("EventReopen.js");
                    Log.info("Run PrepareReopen.js..................................");
                    r.RunJS("PrepareReopen.js");
                    Log.info("Run StateDispatch.js..................................");
                    r.RunJS("StageDispatch.js");
                    break;
                case 11:
                    Log.info("Run EventClose..,.... ..............................");
                    r.RunJS("EventClose.js");
                    Log.info("Run PrepareClose..,.... ..............................");
                    r.RunJS("PrepareClose.js");
                    Log.info("Run StageDispatch.js..................................");
                    r.RunJS("StageDispatch.js");
                    break;
                case 12:
                    Log.info("Run SendVoiceDone.js..................................");
                    r.RunJS("SendVoiceDone.js");
                    break;
                case 13:
                    Log.info("Run SendVoiceError.js.................................");
                    r.RunJS("SendVoiceError.js");
                    break;
                case 0:
                    Log.info("Processing one Timer..................................");
                    ProcessTimer();
                    break;
                case 90:
                    Log.info("Run LogWorkflow.js..  ................................");
                    r.RunJS("LogWorkflow.js");
                    break;
                case 91:
                    Log.info("Run LogEvent.js.......................................");
                    r.RunJS("LogEvent.js");
                    break;
                case 92:
                    Log.info("Logging all TimerEvents...............................");
                    t.logAllTimerEvents();
                    break;
                case 93:
                    Log.info("Logging DispatchQueue.............................");
                    r.RunJS("LogDispatchQueue.js");
                    break;
                default:
                    Log.info("Quitting..............................................");
                    System.exit(0);
            }
        }
    }

    public void ProcessTimer() {

        String evName = t.dequeueNextTimerEvent();
        switch (evName) {
            default:
                Log.info("Timer Event UnKnown: " + evName);
                break;
            case "no_events":
                Log.info("No Events in the Timer Event List");
            case "ei_send_dispatch":
                Log.info("Run SendDispatch.js...................................");
                r.RunJS("SendDispatch.js");
                break;
            case "ei_send_voice_error":
                Log.info("Run SendVoiceError.js.................................");
                r.RunJS("SendVoiceError.js");
                break;
            case "ei_send_voice_done":
                Log.info("Run SendVoiceDone.js..................................");
                r.RunJS("SendVoiceDone.js");
                break;
            case "ei_ack_sla_breach":
                Log.info("Run PrepareAckSLABreach.js...................................");
                r.RunJS("PrepareAckSLABreach.js");
                break;
            case "ei_rsl_sla_breach":
                Log.info("Run PrepareRslSLABreach.js...................................");
                r.RunJS("PrepareRslSLABreach.js");
                break;
        }
    }
}
