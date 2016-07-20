import {browserHistory} from 'react-router';

export default socket => store => next => action => {

  if (action.type === 'SET_CURRENT_USER') {
    socket.on('validUser', (username) => {
      if (username) {
        console.log(`valid username; ${username}`);
        return next(action);
      }
      console.log(`invalid username; ${username}`);
    });
    socket.emit('validateUser', action.currentUser);

  } else {
    if (action.meta && action.meta.remote) {
      socket.emit('action', action);
    }
    return next(action);
  }
}