/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * WORKFLOW RULES ARE IMPLEMENTED IN THIS JS FILE
 * 
 * Each rule is invoked by the Dispatcher each time an external event comes into the system
 * 
 */

function rule_ee_createticket () {
    var oldState, currEvent, newState, currContext;
    oldState  = 's_idle';
    currEvent = 'ee_ticket_created';
    return runStateMachine(oldState, currEvent, currContext, doNextAction);
    //globals.oldState = newState;

}

function rule_ee_ack () {

    var oldState, currEvent, newState, currContext;
    oldState  = globals.oldState;
    currEvent = 'ee_create_ticket';
    runStateMachine(oldState, currEvent, currContext, doNextAction);
    globals.oldState = newState;
}


