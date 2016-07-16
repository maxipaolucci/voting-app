/**
 * Created by mpaoluc on 31/05/2016.
 */
import {List, Map, fromJS} from 'immutable';
import data from './data';

export const INITIAL_STATE = Map();

export function isValidUser(users, username) {
  if (!users || !username) {
    return false;
  }
  return fromJS(users).includes(username);
}

export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

function getWinners(vote) {
  if (!vote) {
    return [];
  }

  const [a, b] = vote.get('pair');
  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);

  if (aVotes > bVotes) {
    return [a];
  }
  else if (aVotes < bVotes) {
    return [b];
  }
  else {
    return [a, b];
  }
}

export function next(state) {
  const entries = state.get('entries')
      .concat(getWinners(state.get('vote')));

  if (entries.size === 1) {
    return state.remove('vote')
        .remove('entries')
        .set('winner', entries.first());
  } else {
    return state.merge({
      vote: Map({
        pair: entries.take(2),
        round: state.getIn(['vote', 'round'], 0) + 1
      }),
      entries: entries.skip(2)
    });
  }
}

export function vote(voteState, entry, voter) {
  const currentPair = voteState.getIn(['pair']);
  //const validUser =

  if (currentPair && currentPair.includes(entry)) {
    let newVoteState = voteState.updateIn(['voters', voter], '', value => entry);

    return newVoteState.updateIn(
      ['tally', entry],
      0,
      tally => tally + 1
    );
  } else {
    return voteState;
  }

}