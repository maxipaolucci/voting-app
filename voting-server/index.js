import makeStore from './src/store';
import startServer from './src/server';
import data from './src/data';

//load users
console.log(data.users);

export const store = makeStore();
startServer(store);

store.dispatch({
  type: 'SET_ENTRIES',
  entries: require('./entries.json')
});
store.dispatch({type: 'NEXT'});