/**
 * Created by mpaoluc on 31/05/2016.
 */
import {List, Map, fromJS} from 'immutable';
import data from './data';

export const INITIAL_STATE = Map();

export function isValidUser(username, users = data.users) {
  if (!users || !username) {
    return false;
  }
  return fromJS(users).includes(username);
}

export function setEntries(state, entries) {
  return state.set('entries', List(entries))
    .set('originalEntries', List(entries));
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
        pair: entries.take(2)
      }),
      entries: entries.skip(2)
    });
  }
}

export function vote(voteState, entry, voter) {
  if (!voter || !isValidUser(voter)) {
    return voteState;
  }

  const currentPair = voteState.getIn(['pair']);

  if (currentPair && currentPair.includes(entry)) {


    //get if exists a vote from the same voter in the voters prop. If exists means that this user already voted before
    const previousVoteEntry = voteState.getIn(['voters', voter]);

    //create a new vote state object cloning the voteState from params
    let newVoteState = voteState.merge(Map());

    if (previousVoteEntry) {
      //if the voter already voted in this pair then we remove the old vote from the tally counting
      newVoteState = newVoteState.updateIn(
        ['tally', previousVoteEntry],
        0,
        tally => tally - 1
      );
    }

    //update the voters prop with the current entry for the current voter
    newVoteState = newVoteState.updateIn(['voters', voter], '', value => entry);

    //finally adding a tally for the current entry
    return newVoteState.updateIn(
      ['tally', entry],
      0,
      tally => tally + 1
    );
  } else {
    return voteState;
  }

}

export function restart(state) {
  state = state.remove('vote')
    .remove('entries')
    .remove('winner');

  state = setEntries(state, state.get('originalEntries'));
  return next(state);
}