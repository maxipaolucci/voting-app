import {setEntries, next, vote, getUserId, INITIAL_STATE} from './core';

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_ENTRIES':
      return setEntries(state, action.entries);
    case 'NEXT':
      return next(state);
    case 'VOTE':
      return state.update('vote', voteState => vote(voteState, action.entry, action.voter));
    case 'LOGIN':
      const users = require('../users.json');
      return getUserId(users, action.username);
  }
  return state;
}