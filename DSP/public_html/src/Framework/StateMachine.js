// This file contains all the main state machine handling

var states = [
//----OLD STATE--------------------INCOMING EVENT--------------------ACTION TO BE PERFORMED--------------------NEXT STATE------------------------NEW INTERNAL EVENTS----------------
                                                                                                                                                                                 
    { 's_idle'          :   [                                                                                                                                                    
                                { 'ev':'ee_ticket_created',         'ac':'ac_prepare_work',                    'ns':'s_active',                  'ne':[ 'ei_check_work'           ] }  
                            ]                                                                                                                                                    
                    },                                                                                                                                                           
    {'s_active'             : [                                                                                                                                                  
                                { 'ev':'ei_check_work',             'ac':'ac_kickoff_work',                    'ns':'s_active',                  'ne':[ 'ei_notify_ncr',          
                                                                                                                                                        'ei_notify_diebold',      
                                                                                                                                                        'ei_notify_voice',        
                                                                                                                                                        'ei_notify_sms',          
                                                                                                                                                        'ei_notify_email',        
                                                                                                                                                        'ei_notifys_done',        
                                                                                                                                                        'ei_command_predsp'       ] },
                                                                                                                                                                                 
                                { 'ev':'ei_notify_ncr',             'ac':'ac_switch_work',                     'ns':'s_notifying_ncr',           'ne':[ 'ei_notify_ncr'           ] },
                                { 'ev':'ei_notify_diebold',         'ac':'ac_switch_work',                     'ns':'s_notifying_diebold',       'ne':[ 'ei_notify_diebold'       ] },
                                { 'ev':'ei_notify_voice',           'ac':'ac_switch_work',                     'ns':'s_notifying_voice',         'ne':[ 'ei_notify_voice'         ] },
                                { 'ev':'ei_notify_sms',             'ac':'ac_switch_work',                     'ns':'s_notifying_sms',           'ne':[ 'ei_notify_sms'           ] },
                                { 'ev':'ei_notify_email',           'ac':'ac_switch_work',                     'ns':'s_notifying_email',         'ne':[ 'ei_notigy_email'         ] },
                                { 'ev':'ei_command_predsp',         'ac':'ac_switch_work',                     'ns':'s_cmd_predsp',              'ne':[ 'ei_cmd_predsp'           ] },
                                { 'ev':'ei_notifys_done',           'ac':'ac_switch_work',                     'ns':'s_ack_awaited',             'ne':[ ''                        ] }
                            ]                                                                                                                                                    
                    },                                                                                                                                                           
    {'s_cmd_predsp'         : [                                                                                                                                                  
                                { 'ev':'ei_cmd_predsp_ok',          'ac':'ac_sendactivity_predsp_ok',          'ns':'s_active',                  'ne':[ 'ei_check_work'           ] },
                                { 'ev':'ei_cmd_predsp_nok',         'ac':'ac_sendactivity_predsp_nok',         'ns':'s_active',                  'ne':[ 'ei_check_work'           ] }
                            ]                                                                                                                                                    
                        },                                                                                                                                                                
    {'s_notifying_ncr'       : [                                                                                                                                                           
                                { 'ev':'ei_notify_ncr',             'ac':'ac_send2ncr',                        'ns':'s_notifying_ncr',           'ne':[ ''                        ] },
                                { 'ev':'ei_send_ncr_ok',            'ac':'ac_sendactivity_notify_ncr_ok',      'ns':'s_active',                  'ne':[ 'ei_check_work'           ] },
                                { 'ev':'ei_send_ncr_nok',           'ac':'ac_sendactivity_notify_ncr_nok',     'ns':'s_active',                  'ne':[ 'ei_check_work'           ] } 
                            ]                                                                                                                                                    
                        },                                                                                                                                                            
    {'s_notifying_diebold'   : [                                                                                                                                                     
                                { 'ev':'ei_notify_Diebold',         'ac':'ac_send2diebold',                    'ns':'s_notifying_diebold',       'ne':[ ''                        ] },
                                { 'ev':'ei_send_Diebold_ok',        'ac':'ac_sendactivity_notify_diebold_ok',  'ns':'s_active',                  'ne':[ 'ei_check_work'           ] },
                                { 'ev':'ei_send_Diebold_nok',       'ac':'ac_sendactivity_notify_diebold_nok', 'ns':'s_active',                  'ne':[ 'ei_check_work'           ] }
                            ]                                                                                                                                                    
                        },                                                                                                                                                            
    {'s_notifying_email'     : [                                                                                                                                                     
                                { 'ev':'ei_notify_Email',           'ac':'ac_send2email',                      'ns':'s_notifying_email',         'ne':[ ''                        ] },
                                { 'ev':'ei_send_Email_ok',          'ac':'ac_sendactivity_notify_email_ok',    'ns':'s_active',                  'ne':[ 'ei_check_work'           ] },
                                { 'ev':'ei_send_Email_nok',         'ac':'ac_sendactivity_notify_email_nok',   'ns':'s_active',                  'ne':[ 'ei_check_work'           ] } 
                            ]                                                                                                                                                    
                        },                                                                                                                                                            
    {'s_notifying_sms'       : [                                                                                                                                                     
                                { 'ev':'ei_notify_SMS',             'ac':'ac_send2sms',                        'ns':'s_notifying_sms',           'ne':[ ''                        ] },
                                { 'ev':'ei_send_sms_ok',            'ac':'ac_sendactivity_notify_sms_ok',      'ns':'s_active',                  'ne':[ 'ei_check_work'           ] },
                                { 'ev':'ei_send_sms_nok',           'ac':'ac_sendactivity_notify_sms _nok',    'ns':'s_active',                  'ne':[ 'ei_check_work'           ] } 
                            ]                                                                                                                                                    
                        },                                                                                                                                                            
    {'s_notifying_voice'     : [                                                                                                                                                     
                                { 'ev':'ei_notify_Voice',           'ac':'ac_send2voice',                      'ns':'s_notifying_voice',         'ne':[ ''                        ] },
                                { 'ev':'ei_send_voice_ok',          'ac':'ac_sendactivity_notify_voice_ok',    'ns':'s_active',                  'ne':[ 'ei_check_work'           ] },
                                { 'ev':'ei_send_voice_nok',         'ac':'ac_sendactivity_notify_voice_nok',   'ns':'s_active',                  'ne':[ 'ei_check_work'           ] } 
                            ]                                                                                                                                                    
                        },                                                                                                                                                            
    {'s_ack_awaited'         : [                                                                                                                                                     
                                { 'ev':'ee_ack',                    'ac':'ac_sendactivity_ack',                'ns':'s_arrival_awaited',         'ne':[ ''                        ] },
                                { 'ev':'ei_timeout_sla_ack',        'ac':'ac_timeout_ack',                     'ns':'s_ack_awaited',             'ne':[ ''                        ] },
                                { 'ev':'ee_hold',                   'ac':'ac_sendactivity_ack_on_hold',        'ns':'s_ack_awaited',             'ne':[ ''                        ] },
                                { 'ev':'ee_resume',                 'ac':'ac_sendactivity_ack_resumed',        'ns':'s_ack_awaited',             'ne':[ ''                        ] } 
                            ]                                                                                                                                                    
                        },                                                                                                                                                            
    {'s_arrival_awaited'     : [                                                                                                                                                     
                                { 'ev':'ee_arrived',                'ac':'ac_sendactivity_arrived',            'ns':'s_working',                 'ne':[ ''                        ] },
                                { 'ev':'ei_timeout_sla_arrival',    'ac':'ac_timeout_arrival',                 'ns':'s_arrival_awaited',         'ne':[ ''                        ] },
                                { 'ev':'ee_hold',                   'ac':'ac_sendactivity_arrival_on_hold',    'ns':'s_arrival_awaited',         'ne':[ ''                        ] },
                                { 'ev':'ee_resume',                 'ac':'ac_sendactivity_arrival_resumed',    'ns':'s_arrival_awaited',         'ne':[ ''                        ] } 
                            ]                                                                                                                                                    
                        },                                                                                                                                                            
    {'s_working'             : [                                                                                                                                                     
                                { 'ev':'ee_resolved',               'ac':'ac_resolved',                        'ns':'s_resolved',                'ne':['ei_cmd_postdsp'           ] },
                                { 'ev':'ei_timeout_sla_work',       'ac':'ac_timeout_sla_work',                'ns':'s_working',                 'ne':[ ''                        ] },
                                { 'ev':'ei_timeout_sla_resolve',    'ac':'ac_timeout_sla_resolve',             'ns':'s_working',                 'ne':[ ''                        ] },
                                { 'ev':'ee_hold',                   'ac':'ac_sendactivity_work_on_hold',       'ns':'s_working',                 'ne':[ ''                        ] },
                                { 'ev':'ee_resume',                 'ac':'ac_sendactivity_work_resumed',       'ns':'s_working',                 'ne':[ ''                        ] } 
                            ]                                                                                                                                                    
                        },                                                                                                                                                            
    {'s_resolved'            : [                                                                                                                                                     
                                { 'ev':'ei_cmd_postdsp',            'ac':'ac_send2cmd',                        'ns':'s_resolved',                'ne':[ ''                        ] },
                                { 'ev':'ei_cmd_postdsp_ok',         'ac':'ac_sendactivity_postdsp_ok',         'ns':'s_active',                  'ne':[ 'ei_check_work'           ] },
                                { 'ev':'ei_cmd_postdsp_nok',        'ac':'ac_sendactivity_postdsp_nok',        'ns':'s_active',                  'ne':[ 'ei_check_work'           ] } 
                            ]                                                                                                                                                    
                        },                                                                                                                                                           
    {'s_closed'              : [                                                                                                                                                     
                                { 'ev':'ee_closed',                 'ac':'ac_closed',                          'ns':'s_idle',                    'ne':[ ''                        ] } 
                            ]
                        }
//----OLD STATE--------------------INCOMING EVENT--------------------ACTION TO BE PERFORMED--------------------NEXT STATE------------------------NEW INTERNAL EVENTS----------------
];

function getNextAction (oldState, currEvent) {
    
    var action, nextState;
    var SMdata = [action, nextState];
    //alert(JSON.stringify(states[0]));
    
    var currState;
    for (i=0;i< 100;i++) {
        if ( states[i] === oldState ){
            currState = states[i];
            break;
       }
    }
    /*
    
    //alert(currState);
    // make the transition
    for (i=0;i< 100;i++) {
       if ( currState[i].ev === currEvent ){
            SMdata.action    = currState[i].ac;
            SMdata.nextState = currState[i].ns; 
            break;
       }       
    }*/
    return SMdata; 
}


function runStateMachine (oldState,currEvent,currContext) {

    var oS, cE, aC, nS, nE, cC;
    var SMdata = [aC, nS];
    cE = currEvent;
    oS = oldState;
    cC = currContext;
    
    var done = false;
    
    while (!done) {
        SMdata = getNextAction (oS, cE); 
        nS = SMdata.nS;
        aC = SMdata.aC;
        nE = doNextAction (oS,cE,aC,nS,cC);
        if (nE)
             { done = true; }  // get out for wait for external event
        else { oS = nS; }      // cycle thru state machine again
    }
    return nS;
}





