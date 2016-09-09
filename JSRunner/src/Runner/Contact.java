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
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
    //EmailTemplate = Contact.replaceVariables(dq.Template, {Workflow: Workflow});
    public Object replaceVariables (ScriptObjectMirror mirror) throws IOException {
     
        Map tmp =(Map) mirror.get("template");
        Map mp = (Map) mirror.get("Workflow");
        
        StringBuilder sb = new StringBuilder();
        sb.append( (String) tmp.get("name"));
        sb.append( (String) tmp.get("body"));
        sb.append( (String) tmp.get("description"));
        sb.append( (String) tmp.get("subject"));
        sb.append( (String) tmp.get("templateType"));
        String str1 = sb.toString();
        String str2 = str1.replace("Workflow.", "");
        String str3 = repVariables(str2, mp);      
        return JSONFunctions.parse(str3, mirror);
    }
    
       private static final Pattern pattern = Pattern.compile("<%=\\s*([^%\\s]+\\s*)%>");

    public String repVariables(String input, Map<String, String> variables) {
        StringBuffer sb = new StringBuffer();
        if (variables != null) {
            Log.debug("replaceVariables; input={}", input);
            Matcher m = pattern.matcher(input);
            while (m.find()) {
                String name = m.group(1);
                String value = variables.get(name);
                Log.debug("replaceVariables; {}={}", name, value);
                if (value == null) {
                    value = m.group(0);
                }
                m.appendReplacement(sb, value);
            }
            m.appendTail(sb);
        }
        return sb.toString();
    }
}
