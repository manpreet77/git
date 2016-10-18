/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import Runner.Timer.TimerEvent;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.slf4j.Logger;

/**
 *
 * @author Shridhar, Manpreet
 */
public class Timer {

    private LinkedHashMap<String, TimerEvent> tl;
    private Logger Log;

    public Timer(LinkedHashMap tl, Logger l) {
        this.tl = tl;
        this.Log = l;
    }

    public long create(String eventName, long delayMs) {
        Log.info("Start Timer : " + eventName + " for " + delayMs + " ms");
        long id = System.currentTimeMillis();
        tl.put(String.valueOf(id), new TimerEvent(delayMs, eventName));
        sortByValue();
        return id;
    }

    public long create(String eventName, long delayMs, Map<String, String> properties) {
        Log.info("Start Timer : " + eventName + " for " + delayMs + " ms" + ((properties != null) ? "  Properties:" + properties.toString() : ""));
        long id = System.currentTimeMillis();
        tl.put(String.valueOf(id), new TimerEvent(delayMs, eventName, properties));
        sortByValue();
        return id;
    }

    public long create(String eventName, long delayMs, Map<String, String> properties, boolean allowTimerWithSameName) {
        Log.info("Start Timer : " + eventName + " for " + delayMs + " ms" + ((properties != null) ? "  Properties:" + properties.toString() : ""));
        long id = System.currentTimeMillis();
        tl.put(String.valueOf(id), new TimerEvent(delayMs, eventName, properties));
        sortByValue();
        return id;
    }

    public long start(ScriptObjectMirror mirror) {
        String eventName;
        Map<String, String> p;
        HashMap<String, String> p1;
        long delayMs;

        eventName = (String) mirror.get("eventName");
        delayMs = (new Double(Double.parseDouble(mirror.get("delayMs").toString()))).longValue();
        if (eventName.isEmpty() || delayMs < 0) {
            throw new IllegalArgumentException("eventName=" + eventName + ", delayMs=" + delayMs);
        }
        p = (Map) mirror.get("properties");
        
        if (p == null) {
            return create(eventName, delayMs);
        } else {
            p1 = new HashMap<>();
            p1.putAll(p);
            return create(eventName, delayMs, p1, true);
        }
    }

    public void cancel(String eventName) {
        Log.info("Stop Timer : " + eventName);

        Iterator itr = tl.entrySet().iterator();
        while (itr.hasNext()) {
            Map.Entry<String, TimerEvent> te = (Map.Entry<String, TimerEvent>) itr.next();
            if (te.getValue().eventName.equalsIgnoreCase(eventName)) {
                itr.remove();
                Log.info("Removed TimeEvent: " + eventName);
            }
        }
    }

    public void cancel(String eventName, String id) {
        Log.info("Stop Timer : name = " + eventName + " id = " + id);
        tl.remove(id);
    }

    public void cancel(ScriptObjectMirror mirror) {
        String eventName = "";
        eventName = (String) mirror.get("eventName");
        if (eventName.isEmpty()) {
            throw new IllegalArgumentException("eventName=" + eventName);
        }
        String id = (String) mirror.get("id");
        if (id != null) {
            cancel(eventName, id);
        } else {
            cancel(eventName);
        }
    }

    public TimerEvent dequeueNextTimerEvent() {

        TimerEvent te = null;
        if (tl.size() > 0) {
            for (Map.Entry me : tl.entrySet()) {
                te = (TimerEvent) me.getValue();
                if (te == null) {
                    return null;
                }

                //Log.info("NextTimerEvent : " + te.eventName + " delayMs : " + te.delayMs + ((te.properties != null) ? "  Properties:" + te.properties.toString() : ""));
                Log.info("NextTimerEvent : " + te.toString());
                tl.remove((String) me.getKey());
                break;
            }
        }
        return te;
    }

    public void logAllTimerEvents() {

        Log.info("TimerEvent List..............................\n");
        TimerEvent te = null;
        if (tl.size() > 0) {
            for (Map.Entry me : tl.entrySet()) {
                te = (TimerEvent) me.getValue();
                Log.info("TimerEvent - " + "id: " + me.getKey() + " , Value: " + te.toString());
            }
        }
        Log.info("TimerEvent List..............................\n");

    }

    private void sortByValue() {
        // 1. Convert Map to List of Map
        List<Map.Entry<String, TimerEvent>> list
                = new LinkedList<>(tl.entrySet());

        // 2. Sort list with Collections.sort(), provide a custom Comparator
        //    Try switch the o1 o2 position for a different order
        Collections.sort(list, (Map.Entry<String, TimerEvent> o1, Map.Entry<String, TimerEvent> o2) -> (o1.getValue().delayMs).compareTo(o2.getValue().delayMs));

        // 3. Loop the sorted list and put it into a new insertion order Map LinkedHashMap
        //Map<Long, TimerEvent> sortedMap = new LinkedHashMap<>();
        tl.clear();
        list.stream().forEach((entry) -> {
            tl.put(entry.getKey(), entry.getValue());
        });
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
        public Long delayMs;
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
            return "Timer Event: " + this.eventName + "    Delay Ms: " + this.delayMs + ((this.properties != null) ? "  Properties:" + properties.toString() : "");
        }
        
    }

}
