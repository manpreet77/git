/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Runner;

import java.util.Arrays;
import jdk.nashorn.api.scripting.ScriptObjectMirror;
import org.slf4j.Logger;

/**
 *
 * @author Shridhar
 */
public class AdaptorEmail {

    private Logger Log;

    public AdaptorEmail(Logger l) {
        this.Log = l;
    }

    public void send(ScriptObjectMirror mirror) {

        System.out.println(mirror.getClassName() + ": "
                + Arrays.toString(mirror.getOwnKeys(true)));
        String to           = "";
        String cc           = "";
        String subject      = "";
        String body         = "";
        String htmlEmail    = "";
        to                  = (String) mirror.get("to");
        cc                  = (String) mirror.get("cc");
        subject             = (String) mirror.get("subject");
        body                = (String) mirror.get("body");
        htmlEmail           = (String) mirror.get("htmlEmail");

        if (to.isEmpty() || subject.isEmpty() || body.isEmpty() ||
            !htmlEmail.equalsIgnoreCase("true")) {
            throw new IllegalArgumentException("email.send received bad parameters");
        }
        Log.info ("AdaptorEmail: "+to+" || "+cc+" || "+subject+" || "+body+" || "+htmlEmail);
    }
}
//TODO
//var EmailTemplate = Contact.replaceVariables(dq.Template, {Workflow: Workflow});
/*email.send( {to: dq.Address, subject: EmailTemplate.subject, body: EmailTemplate.body, htmlEmail: "true" } );*/
