/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import java.util.Map;

/**
 *
 * @author Shridhar
 */
public class StaticVariableSource implements VariableSource {

    private final Map<String, String> variables;

    public StaticVariableSource(Map<String, String> variables) {
        this.variables = variables;
    }

    @Override
    public boolean hasVariable(String name) {
        return variables.containsKey(name);
    }

    @Override
    public String getValue(String name) {
        return variables.get(name);
    }

}
