/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.util.HashMap;
import java.util.logging.Level;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import org.slf4j.Logger;

//import org.mozilla.javascript.Context;
//import org.mozilla.javascript.Scriptable;
/**
 *
 * @author vriha
 */
class JSRunner {

    HashMap Workflow;
    HashMap Event;
    Timer Timer;
    Logger Log;
    String jsType;
    String jsFile;

    public JSRunner(HashMap w, HashMap e, Timer t, Logger l, String js) {
        Workflow = w;
        Event = e;
        Timer = t;
        Log = l;
        jsType = js;
    }

    public void RunJS(String theFile) {
        jsFile = theFile;
        switch (jsType) {
            case "nashorn":
                runNashorn();
                break;
            case "rhino":
                runRhino();
                break;
            default:
                Log.info("Invalid jsType");
                System.exit(-200);
                break;
        }
    }

    public void runNashorn() {

        try {
            ScriptEngineManager factory = new ScriptEngineManager();
            ScriptEngine engine = factory.getEngineByName("nashorn");
            engine.put("Timer", Timer);
            engine.put("Workflow", Workflow);
            engine.put("Event", Event);
            engine.put("Log", Log);
            
            String scriptFilePath = System.getProperty("user.dir") + System.getProperty("file.separator")
                    + "src" + System.getProperty("file.separator")                    
                    + "jsFiles" + System.getProperty("file.separator")
                    + jsFile;
            File scriptFile = new File(scriptFilePath);
            Log.info(scriptFile.getAbsolutePath());
            
            if(System.getProperty("os.name").toLowerCase().contains("win")){
                engine.eval (new FileReader(scriptFile));
            } else {            
                engine.eval("load(\"" + scriptFile + "\");");
            }
            
            } catch (FileNotFoundException | ScriptException e) {
            Log.error(e.getMessage());        
        }
    }

    public void runRhino() {

//        try {
//            Context cx = Context.enter();
//            Scriptable scope = cx.initStandardObjects();
//            File file = new File("test.txt");
//            scope.put("file",scope, file);
//            scope.put("n",scope, 1);
//            scope.put("Timer",scope, Timer);
//            Workflow.put("Test", "T");
//            scope.put("Workflow", scope, Workflow);
//            scope.put("log",scope, Log);
//            Reader in;
//            String scriptFile = System.getProperty("user.dir").concat("\\jsFiles\\test.js");
//            Log.info("Script File = " + scriptFile);
//            in = new FileReader(scriptFile);
//            cx.evaluateReader(scope, in, scriptFile, 1, null);
//
//        } catch (FileNotFoundException e) {
//            Log.error(e.getMessage());
//        } catch (IOException ex) {
//            java.util.logging.Logger.getLogger(JSRunner.class.getName()).log(Level.SEVERE, null, ex);
//        }
    }
}
