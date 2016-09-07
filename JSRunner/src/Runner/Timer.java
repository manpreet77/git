/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import Runner.Timer.TimerEvent;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import org.slf4j.Logger;

/**
 *
 * @author Shridhar
 */
public class Timer {

    private List<Runner.Timer.TimerEvent> tl;
    private Logger Log;

    public Timer(List tl, Logger l) {
        this.tl = tl;
        this.Log = l;
    }    
    
    public void create(String eventName, Integer delayMs) {
        Log.info("Start Timer : " + eventName + " for " + delayMs + " ms");
        tl.add(new TimerEvent(delayMs, eventName));
        Collections.sort(tl, new CompareTimerEvent());
    }

    public void cancel(String eventName) {
        Log.info("Stop Timer : " + eventName);
        for (int i = 0; i < tl.size(); i++) {
            TimerEvent te = tl.get(i);
            if (te.eventName.equalsIgnoreCase(eventName)) {
                tl.remove(i);
                Log.info("Removed TimeEvent: " + tl.get(i));
            }
            Collections.sort(tl, new CompareTimerEvent());
        }
    }

    public String dequeueNextTimerEvent() {

        TimerEvent te = tl.get(0);
        if (te == null) {
            return "no_events";
        }
        Log.info("NextTimerEvent : " + te.eventName + " delayMs : " + te.delayMs);
        tl.remove(0);
        return te.eventName;
    }

    public void logAllTimerEvents() {

        Log.info("TimerEvent List..............................\n");
        for (int i = 0; i < tl.size(); i++) {
            Log.info("TimeEvent: " + tl.get(i));
        }
        Log.info("TimerEvent List..............................\n");

    }

    class CompareTimerEvent implements Comparator<TimerEvent> {

        @Override
        public int compare(TimerEvent e1, TimerEvent e2) {
            if (e1.delayMs < e2.delayMs) {
                return -1;
            } else {

                return 1;
            }
        }
    }

    class TimerEvent {

        public String eventName;
        public int delayMs;

        public TimerEvent(int d, String n) {
            this.eventName = n;
            this.delayMs = d;
        }

        public String toString() {
            return "Event: " + this.eventName + "    Delay Ms: " + this.delayMs + "\n";
        }
    }

}
