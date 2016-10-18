/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

/**
 *
 * @author Shridhar, Manpreet
 */
public interface VariableSource {

    boolean hasVariable(String name);
    String getValue(String name);
}