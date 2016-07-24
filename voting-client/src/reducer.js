import {Map} from 'immutable';

function setState(state, newState) {
  //we wrap newState in map coz it come like a js object from the server
  if (Map(newState).has('winner')) {
    //this means that the remote state (newState) come with a winner so we have to remove entries and vote
    //from our local state
    state = state.remove('entries').remove('vote');
  } else if (state.has('winner')) {
    //if the new state(remote) does not have a winner and my local state has it then that means
    //the remote state was restarted after a winner occur so we have to remove the local one
    state = state.remove('winner');
  }
  return state.merge(newState);
}

function setCurrentUser(state, currentUser) {
  return state.set('currentUser', currentUser);
}

export default function(state = Map(), action) {
  switch (action.type) {
    case 'SET_STATE':
      return setState(state, action.state);

    case 'SET_CURRENT_USER':
      return setCurrentUser(state, action.currentUser);

    default:
      return state;
  }
}