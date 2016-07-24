import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {

    it('handles SET_STATE', () => {
        const initialState = Map();
        const action = {
            type: 'SET_STATE',
            state: Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({Trainspotting: 1})
                })
            })
        };
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later'],
                tally: {Trainspotting: 1}
            }
        }));
    });

    it('handles SET_STATE with plain JS payload', () => {
        const initialState = Map();
        const action = {
            type: 'SET_STATE',
            state: {
                vote: {
                    pair: ['Trainspotting', '28 Days Later'],
                    tally: {Trainspotting: 1}
                }
            }
        };
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later'],
                tally: {Trainspotting: 1}
            }
        }));
    });

    it('handles SET_STATE without initial state', () => {
        const action = {
            type: 'SET_STATE',
            state: {
                vote: {
                    pair: ['Trainspotting', '28 Days Later'],
                    tally: {Trainspotting: 1}
                }
            }
        };
        const nextState = reducer(undefined, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later'],
                tally: {Trainspotting: 1}
            }
        }));
    });

    it('handles SET_STATE with local initial state and a winner state comming from remote', () => {
        const initialState = fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later'],
                tally: {Trainspotting: 1}
            },
            originalEntries: ['Trainspotting', '28 Days Later', 'Steve Jobs'],
            entries: ['Steve Jobs']
        })
        const action = {
            type: 'SET_STATE',
            state: {
                winner: 'Trainspotting',
                originalEntries: ['Trainspotting', '28 Days Later', 'Steve Jobs']
            }
        };
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            winner: 'Trainspotting',
            originalEntries: ['Trainspotting', '28 Days Later', 'Steve Jobs']
        }));
    });

    it('handles SET_STATE when restarted after got a winner in the previous state', () => {
        const initialState = fromJS({
            winner: 'Trainspotting',
            originalEntries: ['Trainspotting', '28 Days Later', 'Steve Jobs']
        })
        const action = {
            type: 'SET_STATE',
            state: {
                vote: {
                    pair: ['Trainspotting', '28 Days Later']
                },
                originalEntries: ['Trainspotting', '28 Days Later', 'Steve Jobs'],
                entries: ['Steve Jobs']
            }
        };
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later']
            },
            originalEntries: ['Trainspotting', '28 Days Later', 'Steve Jobs'],
            entries: ['Steve Jobs']
        }));
    });

    it('handles VOTE by returning the same state', () => {
        const state = fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later'],
                tally: {Trainspotting: 1}
            }
        });
        const action = {type: 'VOTE', entry: 'Trainspotting'};
        const nextState = reducer(state, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later'],
                tally: {Trainspotting: 1}
            }
        }));
    });

    it('handles SET_CURRENT_USER by returning a state with the current user set', () => {
        const state = fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later'],
                tally: {Trainspotting: 1}
            }
        });
        const action = {type: 'SET_CURRENT_USER', currentUser: 'maxi'};
        const nextState = reducer(state, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Trainspotting', '28 Days Later'],
                tally: {Trainspotting: 1}
            },
            currentUser: 'maxi'
        }));
    });

});