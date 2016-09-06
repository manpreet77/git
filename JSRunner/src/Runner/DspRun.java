/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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
        List<Runner.Timer.TimerEvent> tl = new ArrayList<Runner.Timer.TimerEvent>();
        Logger l = LoggerFactory.getLogger(DspRun.class);
        Timer t   = new Timer(tl,l);
        
        
        String j = "nashorn";
        
        JSRunner r = new JSRunner (w, e, t, l, j);
         
        CmdLine cmd = new CmdLine(r, tl, t, l);
        cmd.Loop();

    }

}
