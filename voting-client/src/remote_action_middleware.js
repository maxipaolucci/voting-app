
export default socket => store => next => action => {

  if (action.type === 'SET_CURRENT_USER') {
    socket.on('validUser', (username) => {
      if (!username) {
        action.currentUser = '-1';
        console.log(`invalid username; ${username}`);
      }
      return next(action);

    });
    socket.emit('validateUser', action.currentUser);

  } else {
    if (action.meta && action.meta.remote) {
      socket.emit('action', action);
    }
    return next(action);
  }
}