/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import java.io.IOException;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.slf4j.Logger;
import java.nio.file.Files;
import java.nio.file.Paths;
import jdk.nashorn.internal.parser.JSONParser;
import jdk.nashorn.internal.runtime.JSONFunctions;
import jdk.nashorn.internal.runtime.Source;

/**
 *
 * @author Shridhar
 */
public class Contact {

    private Logger Log;

    public Contact(Logger l) {
        this.Log = l;
    }

    public Object queryActionRule(ScriptObjectMirror mirror) throws  IOException {

        String responseFile;
        responseFile = System.getProperty("user.dir") + System.getProperty("file.separator")
                + "src" + System.getProperty("file.separator")
                + "jsFiles" + System.getProperty("file.separator")
                + "queryActionResponse.json";
        
        String content = new String (Files.readAllBytes(Paths.get(responseFile)), "UTF-8");
        return JSONFunctions.parse(content, mirror);
        //return content;
    }
}
