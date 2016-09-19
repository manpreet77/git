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
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import jdk.nashorn.internal.runtime.JSONFunctions;

/**
 *
 * @author Shridhar
 */
public class Contact {

    private final Logger Log;

    public Contact(Logger l) {
        this.Log = l;
    }

    public Object queryActionRule(ScriptObjectMirror mirror) throws IOException {

        String responseFileName = "";
        
        switch ((String) mirror.get("lifecycle")) {
            case "Create":
                responseFileName = "queryActionCreateResponse.json";
                break;
            case "Ack":
                responseFileName = "queryActionAckResponse.json";
                break;
            case "Resolve":
                responseFileName = "queryActionResolveResponse.json";
                break;
        }
        
        
        String responseFile = System.getProperty("user.dir") + System.getProperty("file.separator")
                + "src" + System.getProperty("file.separator")
                + "jsFiles" + System.getProperty("file.separator")
                + responseFileName;

        String content = new String(Files.readAllBytes(Paths.get(responseFile)), "UTF-8");
        return JSONFunctions.parse(content, mirror);        
    }
    
    
            
    public Object queryDispatchMapWithNextAvailableUser(ScriptObjectMirror mirror) throws IOException {

        String responseFileName = "";
        
        switch ((String) mirror.get("lifecycle")) {
            case "Create":
                //responseFileName = "queryActionNextAvlUserCreateResponse.json";
                responseFileName = "queryActionNextAvlUserCreateResponseWithNextAvlTIme.json";
                break;
            case "Ack":
                responseFileName = "queryActionNextAvlUserAckResponse.json";
                break;
            case "Resolve":
                responseFileName = "queryActionNextAvlUserResolveResponse.json";
                break;
        }
        
        
        String responseFile = System.getProperty("user.dir") + System.getProperty("file.separator")
                + "src" + System.getProperty("file.separator")
                + "jsFiles" + System.getProperty("file.separator")
                + responseFileName;

        String content = new String(Files.readAllBytes(Paths.get(responseFile)), "UTF-8");
        return JSONFunctions.parse(content, mirror);
    }
    
    
    
    private static final Pattern pattern = Pattern.compile("<%=\\s*([^%\\s]+\\s*)%>");

//  This is the original signature that exists in dispatcher Need to be worked on
    public void replaceVariables(ScriptObjectMirror template, ScriptObjectMirror... sources) throws Exception {
        MessageTemplateVariables variables = loadVariables(sources);
        Map<String, String> fields = new HashMap();
        for (String fieldName : template.keySet()) {
            fields.put(fieldName, (String) template.get(fieldName));
        }
        Map<String, String> updatedFields = MessageTemplateEngine.replaceVariables(fields, variables);
        for (String key : updatedFields.keySet()) {
            template.put(key, updatedFields.get(key));
        }
    }

    private MessageTemplateVariables loadVariables(ScriptObjectMirror... sources) {
        MessageTemplateVariables variables = new MessageTemplateVariables();
        if (sources == null) {
            return variables;
        }
        for (ScriptObjectMirror sourceItem : sources) {
            for (String sourceName : sourceItem.keySet()) {
                HashMap<String, String> sourceMirror = (HashMap) sourceItem.get(sourceName);
                Map<String, String> sourceFields = new HashMap<>();
                for (String sourceFieldName : sourceMirror.keySet()) {
                    sourceFields.put(sourceFieldName, (String) sourceMirror.get(sourceFieldName));
                    variables.addSource(sourceName, sourceFields);
                }
            }
        }
        return variables;
    }
}
