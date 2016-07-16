import {List, Map} from 'immutable';
import {expect} from 'chai';
import {setEntries, next, vote, getUserId} from '../src/core';

describe('application logic', () => {

  describe('getUserId', () => {

    it('the username is maxi', () => {
      const users = {"maxi" : 1000, "jesi" : 1001};
      const userId = getUserId(users, 'maxi');
      expect(userId).to.equal(1000);
    });

    it('the username is undefined', () => {
      const users = {"maxi" : 1000, "jesi" : 1001};
      const userId = getUserId(users, undefined);
      expect(userId).to.equal(false);
    });

    it('the username does not exists', () => {
      const users = {"maxi" : 1000, "jesi" : 1001};
      const userId = getUserId(users, "juan");
      expect(userId).to.equal(false);
    });

    it('the username is null', () => {
      const users = {"maxi" : 1000, "jesi" : 1001};
      const userId = getUserId(users, null);
      expect(userId).to.equal(false);
    });

    it('the username is numeric', () => {
      const users = {"maxi" : 1000, "jesi" : 1001};
      const userId = getUserId(users, 10);
      expect(userId).to.equal(false);
    });

    it('the users is undefined', () => {
      const userId = getUserId(undefined, 'maxi');
      expect(userId).to.equal(false);
    });

    it('the users is empty', () => {
      const users = {};
      const userId = getUserId(users, 'maxi');
      expect(userId).to.equal(false);
    });

    it('the users is an inmutable', () => {
      const users = Map({"maxi" : 1000, "jesi" : 1001});
      const userId = getUserId(users, "jesi");
      expect(userId).to.equal(1001);
    });
  });

  describe('setEntries', () => {

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later')
      }));
    });

  });

  describe('next', () => {

    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          round: 1
        }),
        entries: List.of('Sunshine')
      }));
    });

    it('puts winner of current vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          }),
          voters: Map({
            1000: 'Trainspotting',
            1001: 'Trainspotting',
            1002: 'Trainspotting',
            1003: 'Trainspotting',
            1004: '28 Days Later',
            1005: '28 Days Later',
          }),
          round: 2
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions'),
          round: 3
        }),
        entries: List.of('127 Hours', 'Trainspotting')
      }));
    });

    it('puts both from tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 3
          }),
          voters: Map({
            1000: 'Trainspotting',
            1001: 'Trainspotting',
            1002: '28 Days Later',
            1003: 'Trainspotting',
            1004: '28 Days Later',
            1005: '28 Days Later',
          }),
          round: 1
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions'),
          round: 2
        }),
        entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
      }));
    });

    it('marks winner when just one entry left', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 4,
            '28 Days Later': 2
          }),
          voters: Map({
            1000: 'Trainspotting',
            1001: 'Trainspotting',
            1002: 'Trainspotting',
            1003: 'Trainspotting',
            1004: '28 Days Later',
            1005: '28 Days Later',
          }),
          round: 4
        }),
        entries: List()
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        winner: 'Trainspotting'
      }));
    });

  });

  describe('vote', () => {

    it('creates a tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later')
      });
      const nextState = vote(state, 'Trainspotting', 1000);
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 1
        }),
        voters: Map({
          1000: 'Trainspotting'
        })
      }));
    });

    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        }),
        voters: Map({
          1000: 'Trainspotting',
          1001: 'Trainspotting',
          1002: 'Trainspotting',
          1004: '28 Days Later',
          1005: '28 Days Later',
        })
      });
      const nextState = vote(state, 'Trainspotting', 1003);
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 2
        }),
        voters: Map({
          1000: 'Trainspotting',
          1001: 'Trainspotting',
          1002: 'Trainspotting',
          1003: 'Trainspotting',
          1004: '28 Days Later',
          1005: '28 Days Later',
        })
      }));
    });

  });
});