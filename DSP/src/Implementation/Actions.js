/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function doNextAction (oldState, currEvent, action, newState) {
    
    var newEvent, actionId;

    switch (action){
        case 'ac_prepare_work'    :  newEvent = ac_prepare_work (oldState, currEvent, action, newState); break;
        case 'ac_kickoff_work'    :  newEvent = ac_kickoff_work (oldState, currEvent, action, newState); break;
        case 'ac_send2ncr'        :  newEvent = ac_send2ncr     (oldState, currEvent, action, newState); break;
    }
    return newEvent;
}

function ac_prepare_work  (oldState, currEvent, action, newState) {
    
    // Initialize Globals
    
    // Load DispatchMaps
    
    // Load Adaptor Instances
    
    // Setup Logger

}

function ac_kickoff_work  (oldState, currEvent, action, newState) {
    
    // Create Queue of Internal Events of notifications 
    // Switch Work will pull one by one

}

function ac_switch_work  (oldState, currEvent, action, newState) {
    
    // Pull the next Internal Event from the Queue and return 

}

function ac_send2ncr      (oldState, currEvent, action, newState) {

}


