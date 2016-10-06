/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import Runner.Timer.TimerEvent;
import java.util.Comparator;
import java.util.Map;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.slf4j.Logger;

/**
 *
 * @author Shridhar
 */
public class Timer {

    private Map<Long, TimerEvent> tl;
    private Logger Log;

    public Timer(Map tl, Logger l) {
        this.tl = tl;
        this.Log = l;
    }

    public void create(String eventName, long delayMs) {
        Log.info("Start Timer : " + eventName + " for " + delayMs + " ms");
        tl.put(System.currentTimeMillis(), new TimerEvent(delayMs, eventName));

    }

    public long create(String eventName, long delayMs, Map<String, String> properties) {
        Log.info("Start Timer : " + eventName + " for " + delayMs + " ms" + ((properties != null) ? "  Properties:" + properties.toString() : ""));
        Long id = System.currentTimeMillis();
        tl.put(id, new TimerEvent(delayMs, eventName, properties));
        return id;
    }

    public void start(ScriptObjectMirror mirror) {
        String eventName;
        Map<String, String> p;
        long delayMs;

        eventName = (String) mirror.get("eventName");
        delayMs = (new Double(Double.parseDouble(mirror.get("delayMs").toString()))).longValue();
        if (eventName.isEmpty() || delayMs < 0) {
            throw new IllegalArgumentException("eventName=" + eventName + ", delayMs=" + delayMs);
        }
        p = (Map) mirror.get("properties");
        if (p == null) {
            create(eventName, delayMs);
        } else {
            create(eventName, delayMs, p);
        }
    }

    public void cancel(String eventName) {
        Log.info("Stop Timer : " + eventName);

        for (Map.Entry me : tl.entrySet()) {

            if (((TimerEvent) me.getValue()).eventName.equalsIgnoreCase(eventName)) {
                tl.remove((Long) me.getKey());
                Log.info("Removed TimeEvent: " + ((TimerEvent) me.getValue()).eventName);
            }
        }
    }

    public void cancel(String eventName, long id) {
        Log.info("Stop Timer : name = " + eventName + " id = " + id);
        tl.remove(id);
    }

    public void cancel(ScriptObjectMirror mirror) {
        String eventName = "";
        eventName = (String) mirror.get("eventName");
        if (eventName.isEmpty()) {
            throw new IllegalArgumentException("eventName=" + eventName);
        }
        Long id = (Long) mirror.get("id");
        if (id != null) {
            cancel(eventName, id);
        } else {
            cancel(eventName);
        }
    }

    /*public String dequeueNextTimerEvent() {

        TimerEvent te = null;
        if (tl.size() > 0) {
            for (Map.Entry me : tl.entrySet()) {
                te = (TimerEvent) me.getValue();
                if (te == null) {
                    return "no_events";
                }
                
                Log.info("NextTimerEvent : " + te.eventName + " delayMs : " + te.delayMs + ((te.properties != null) ? "  Properties:" + te.properties.toString() : ""));
                tl.remove((Long)me.getKey());
                break;
            }
        }
        return te.eventName;
    }*/
    
    
    public TimerEvent dequeueNextTimerEvent() {

        TimerEvent te = null;
        if (tl.size() > 0) {
            for (Map.Entry me : tl.entrySet()) {
                te = (TimerEvent) me.getValue();
                if (te == null) {
                    return null;
                }
                
                Log.info("NextTimerEvent : " + te.eventName + " delayMs : " + te.delayMs + ((te.properties != null) ? "  Properties:" + te.properties.toString() : ""));
                tl.remove((Long)me.getKey());
                break;
            }
        }
        return te;
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
        public long delayMs;
        public Map<String, String> properties;

        public TimerEvent(long d, String n) {
            this.eventName = n;
            this.delayMs = d;
        }

        public TimerEvent(long d, String n, Map<String, String> p) {
            this.eventName = n;
            this.delayMs = d;
            this.properties = p;
        }

        @Override
        public String toString() {
            return "Event: " + this.eventName + "    Delay Ms: " + this.delayMs + ((this.properties != null) ? "  Properties:" + properties.toString() : "") + "\n";
        }
    }

}
