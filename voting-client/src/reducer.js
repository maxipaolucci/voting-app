import {List, Map, fromJS} from 'immutable';

function setState(state, newState) {
    const newStateRound = fromJS(newState).getIn(['vote', 'round'], 1);
    if (state.hasIn(['vote', 'round']) && state.getIn(['vote', 'round']) != newStateRound) {
        return resetVote(state.merge(newState));
    } else {
        return state.merge(newState);
    }
}

function vote(state, entry) {
    const currentPair = state.getIn(['vote', 'pair']);
    if (currentPair && currentPair.includes(entry)) {
        return state.set('hasVoted', entry);
    } else {
        return state;
    }
}

function resetVote(state) {
    const hasVoted = state.get('hasVoted');
    if (hasVoted) {
        return state.remove('hasVoted');
    } else {
        return state;
    }
}

export default function(state = Map(), action) {
    switch (action.type) {
        case 'SET_STATE':
            return setState(state, action.state);
        case 'VOTE':
            return vote(state, action.entry);
    }
    return state;
}