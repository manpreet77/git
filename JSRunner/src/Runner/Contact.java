/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.slf4j.Logger;

/**
 *
 * @author Shridhar
 */
public class Contact {

    private Logger Log;

    public Contact(Logger l) {
        this.Log = l;
    }

    public String queryActionRule(ScriptObjectMirror mirror) throws FileNotFoundException, IOException {

        String responseFile;
        responseFile = System.getProperty("user.dir") + System.getProperty("file.separator")
                + "src" + System.getProperty("file.separator")
                + "jsFiles" + System.getProperty("file.separator")
                + "queryActionResponse.json";
        File rf = new File(responseFile);
        StringBuilder response = new StringBuilder();
        try (
                BufferedReader br = new BufferedReader(new FileReader(rf))) {
            String sCurrentLine;
            while ((sCurrentLine = br.readLine()) != null) {
                response.append(sCurrentLine);
            }
        } catch (IOException e) {
            Log.error(e.getMessage());
        }
        return response.toString().replace('"', '\'');
    }
}
