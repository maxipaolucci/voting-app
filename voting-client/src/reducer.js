import {Map} from 'immutable';

function setState(state, newState) {
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