import Server from 'socket.io';
import {isValidUser} from './core';

export default function startServer(store) {
  const io = new Server().attach(8090);

  store.subscribe(
      () => io.emit('state', store.getState().toJS())
  );

  io.on('connection', (socket) => {
    console.log('client connected!.');

    socket.emit('state', store.getState().toJS());

    socket.on('action', store.dispatch.bind(store));

    socket.on('validateUser', (username) => {
      if (isValidUser(username)) {
        socket.emit('validUser', username);
        console.log('valid user: ' + username);
      } else {
        socket.emit('validUser', false);
        console.log('invalid user: ' + username);
      }
    })
  });
}