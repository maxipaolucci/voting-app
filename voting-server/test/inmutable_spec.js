import {expect} from 'chai';
import {List, Map} from 'immutable';

describe('immutability', () => {

  describe('a tree', () => {

    function addMovie(currentState, movie) {
      return currentState.update('movies', movies => movies.push(movie));
    }

    it('is immutable', () => {
      let state = Map({
        movies: List.of('Trainspotting', '28 Days Later')
      });
      let nextState = addMovie(state, 'Sunshine');

      expect(nextState).to.equal(Map({
        movies: List.of(
            'Trainspotting',
            '28 Days Later',
            'Sunshine'
        )
      }));
      expect(state).to.equal(Map({
        movies: List.of(
            'Trainspotting',
            '28 Days Later'
        )
      }));
    });

  });

  describe('some inmutable functions', () => {

    it('is valid to say with updateIn that', () => {
      let state = Map({
        vote : Map({
          tally : Map()
        })
      });

      let nextState = state.updateIn(['vote', 'tally', 'red'], 0, tally => tally + 1);

      expect(nextState).to.equal(Map({
        vote : Map({
          tally : Map({
            red: 1
          })
        })
      }));
    });

    it('is valid to say with update that', () => {
      let state = Map({
        vote : Map({
          tally : Map({
            red: 1
          })
        })
      });

      let nextState = state.mergeIn(['vote', 'tally'],
          state.getIn(['vote', 'tally']).update('red', tally => tally + 1));

      expect(nextState).to.equal(Map({
        vote : Map({
          tally : Map({
            red: 2
          })
        })
      }));
    });
  });

});