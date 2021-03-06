import {List, Map} from 'immutable';
import {expect} from 'chai';
import {setEntries, next, vote, isValidUser, restart} from '../src/core';

describe('Application logic >', () => {

  describe('isValidUser >', () => {

    it('the username is maxi', () => {
      const users = ["maxi", "jesi"];
      const userId = isValidUser('maxi', users);
      expect(userId).to.equal(true);
    });

    it('the username is undefined', () => {
      const users = ["maxi", "jesi"];
      const userId = isValidUser(undefined, users);
      expect(userId).to.equal(false);
    });

    it('the username does not exists', () => {
      const users = ["maxi", "jesi"];
      const userId = isValidUser("juan", users);
      expect(userId).to.equal(false);
    });

    it('the username is null', () => {
      const users = ["maxi", "jesi"];
      const userId = isValidUser(null, users);
      expect(userId).to.equal(false);
    });

    it('the username is numeric', () => {
      const users = ["maxi", "jesi"];
      const userId = isValidUser(10, users);
      expect(userId).to.equal(false);
    });

    it('the users is empty', () => {
      const users = [];
      const userId = isValidUser('maxi', users);
      expect(userId).to.equal(false);
    });

    it('the users is an inmutable', () => {
      const users = List.of("maxi", "jesi");
      const userId = isValidUser("jesi", users);
      expect(userId).to.equal(true);
    });

    it('load users data by default', () => {
      const userId = isValidUser("jesi");
      expect(userId).to.equal(true);
    });
  });

  describe('setEntries >', () => {

    it('converts to immutable', () => {
      const state = Map();
      const entries = ['Trainspotting', '28 Days Later'];
      const nextState = setEntries(state, entries);
      expect(nextState).to.equal(Map({
        entries: List.of('Trainspotting', '28 Days Later'),
        originalEntries: List.of('Trainspotting', '28 Days Later')
      }));
    });

  });

  describe('next >', () => {

    it('takes the next two entries under vote', () => {
      const state = Map({
        entries: List.of('Trainspotting', '28 Days Later', 'Sunshine')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
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
            "maxi": 'Trainspotting',
            "jesi": 'Trainspotting',
            "juan": 'Trainspotting',
            "fefi": 'Trainspotting',
            "pepe": '28 Days Later',
            "tito": '28 Days Later'
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
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
            "maxi": 'Trainspotting',
            "jesi": 'Trainspotting',
            "juan": 'Trainspotting',
            "fefi": '28 Days Later',
            "pepe": '28 Days Later',
            "tito": '28 Days Later'
          })
        }),
        entries: List.of('Sunshine', 'Millions', '127 Hours')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Sunshine', 'Millions')
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
            "maxi": 'Trainspotting',
            "jesi": 'Trainspotting',
            "juan": 'Trainspotting',
            "fefi": 'Trainspotting',
            "pepe": '28 Days Later',
            "tito": '28 Days Later'
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

  describe('vote >', () => {

    it('creates a tally and voters for the voted entry', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later')
      });
      const nextState = vote(state, 'Trainspotting', "maxi");
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 1
        }),
        voters: Map({
          "maxi": 'Trainspotting'
        })
      }));
    });

    it('adds to existing tally and voters a new vote entry from a new voter', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        }),
        voters: Map({
          "maxi": 'Trainspotting',
          "jesi": 'Trainspotting',
          "juan": 'Trainspotting',
          "pepe": '28 Days Later',
          "tito": '28 Days Later'
        })
      });
      const nextState = vote(state, 'Trainspotting', "fefi");
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 4,
          '28 Days Later': 2
        }),
        voters: Map({
          "maxi": 'Trainspotting',
          "jesi": 'Trainspotting',
          "juan": 'Trainspotting',
          "pepe": '28 Days Later',
          "tito": '28 Days Later',
          "fefi": 'Trainspotting'
        })
      }));
    });

    it('change the option voted before by a voter with a different selection. ' +
      'This decrement the old tally entry by 1 and increments the new one as well as update the voters prop', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        }),
        voters: Map({
          "maxi": 'Trainspotting',
          "jesi": 'Trainspotting',
          "juan": 'Trainspotting',
          "pepe": '28 Days Later',
          "tito": '28 Days Later'
        })
      });
      const nextState = vote(state, '28 Days Later', "maxi");
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 2,
          '28 Days Later': 3
        }),
        voters: Map({
          "maxi": '28 Days Later',
          "jesi": 'Trainspotting',
          "juan": 'Trainspotting',
          "pepe": '28 Days Later',
          "tito": '28 Days Later'
        })
      }));
    });

    it('keep the same state when a voter votes again for the same option in the current pair', () => {
      const state = Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        }),
        voters: Map({
          "maxi": 'Trainspotting',
          "jesi": 'Trainspotting',
          "juan": 'Trainspotting',
          "pepe": '28 Days Later',
          "tito": '28 Days Later'
        })
      });
      const nextState = vote(state, 'Trainspotting', "maxi");
      expect(nextState).to.equal(Map({
        pair: List.of('Trainspotting', '28 Days Later'),
        tally: Map({
          'Trainspotting': 3,
          '28 Days Later': 2
        }),
        voters: Map({
          "maxi": 'Trainspotting',
          "jesi": 'Trainspotting',
          "juan": 'Trainspotting',
          "pepe": '28 Days Later',
          "tito": '28 Days Later'
        })
      }));
    });

  });

  describe('restart >', () => {

    it('restart the app', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later'),
          tally: Map({
            'Trainspotting': 3,
            '28 Days Later': 2
          }),
          voters: Map({
            "maxi": 'Trainspotting',
            "jesi": 'Trainspotting',
            "juan": 'Trainspotting',
            "pepe": '28 Days Later',
            "tito": '28 Days Later'
          })
        }),
        entries: List(),
        originalEntries: List.of('Trainspotting', '28 Days Later', 'Steve Jobs')
      });
      const nextState = restart(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List.of('Steve Jobs'),
        originalEntries: List.of('Trainspotting', '28 Days Later', 'Steve Jobs')
      }));
    });

    it('restart the app when we have a winner', () => {
      const state = Map({
        winner: 'Trainspotting',
        originalEntries: List.of('Trainspotting', '28 Days Later', 'Steve Jobs')
      });
      const nextState = restart(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Trainspotting', '28 Days Later')
        }),
        entries: List.of('Steve Jobs'),
        originalEntries: List.of('Trainspotting', '28 Days Later', 'Steve Jobs')
      }));
    });
  });
});