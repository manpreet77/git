/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import Runner.Timer.TimerEvent;



import java.util.LinkedHashMap;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author vriha
 */
class DspRun {

    public static void main(String[] args) {

        HashMap w = new HashMap();
        HashMap e = new HashMap();
        LinkedHashMap<String, TimerEvent> tl;
        tl = new LinkedHashMap<>();
        Logger l = LoggerFactory.getLogger(DspRun.class);
        Timer t = new Timer(tl, l);
        AdaptorEmail ae = new AdaptorEmail(l);
        Contact ct = new Contact(l);
        HelpDesk hd = new HelpDesk(l);

        String j = "nashorn";

        JSRunner r = new JSRunner(w, e, t, l, j,ae,ct,hd);

        CmdLine cmd = new CmdLine(r, tl, t, l);
        cmd.Loop();

    }

}
