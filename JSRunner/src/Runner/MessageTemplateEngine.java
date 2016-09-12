/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 *
 * @author Shridhar
 */
public class MessageTemplateEngine {

    private static final Pattern pattern = Pattern.compile("%([^%]+)%");

    public static Map<String, String> replaceVariables(Map<String, String> template, MessageTemplateVariables variables) {
        Map<String, String> message = new HashMap<>();
        for (String fieldName : template.keySet()) {
            message.put(fieldName, replaceVariables(template.get(fieldName), variables));
        }
        return message;
    }

    private static String replaceVariables(String field, MessageTemplateVariables variables) {
        StringBuffer sb = new StringBuffer();
        Matcher m = pattern.matcher(field);
        while (m.find()) {
            String name = m.group(1);
            String value = variables.lookup(name);
            if (value == null) {
                value = m.group(0);
            }
            m.appendReplacement(sb, value);
        }
        m.appendTail(sb);
        return sb.toString();
    }

}
