/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 *
 * @author Shridhar
 */
public class MessageTemplateVariables {    
    private static final Pattern splitPattern = Pattern.compile("\\.");
    
    private final Map<String, VariableSource> variableSourcesMap = new HashMap<String, VariableSource>();
    
    public void addSource(String sourceName, Map<String, String> variables) {
        addSource(sourceName, new StaticVariableSource(variables));
    }
    
    public void addSource(String sourceName, VariableSource source) {
        variableSourcesMap.put(sourceName, source);
    }
    
    public String lookup(String name) {
        String[] tmp = splitPattern.split(name);
        if (tmp.length != 2) {
            return null;
        }
        String variableSource = tmp[0];
        String variableName = tmp[1];
        if (variableSourcesMap.containsKey(variableSource) == false) {
            return null;
        }
        VariableSource source = variableSourcesMap.get(variableSource);
        if (source.hasVariable(variableName) == false) {
            return null;
        }
        return source.getValue(variableName);
    }
    
    
}
