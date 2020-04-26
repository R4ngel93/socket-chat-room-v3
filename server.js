/* Set up */
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const colors = require('colors');
const PORT = process.env.PORT || 3000;

/* Serving static files */
app.use(express.static(path.join(__dirname, 'public')));

/* Socket.io */
let users = 0;

io.on('connection', socket => {
  console.log('new connection \u2713 '.bgCyan);

  let online = false;

  /* Add new user */
  socket.on('add user', user => {
    if (online) return;
    if (user !== '') {
      // we store the username in the socket session for this client
      socket.username = user;
      users++;
      online = true;
      //emit login
      socket.emit('login', {
        username: socket.username,
        users: users
      });
      // echo globally (all clients) that a person has connected
      socket.broadcast.emit('user joined', {//change to bradcast
        username: socket.username,
        users: users
      });
      console.log(user);
    }
  });

  /* New message */
  socket.on('new-msg', message => {
    io.emit('new-msg', {
      username: socket.username,
      message: message
    });
  });

  /* Disconnect */
  socket.on('disconnect', () => {
    console.log('client disconnected x '.bgRed);
    if (online) {
      users--;
      socket.broadcast.emit('user left', {
        username: socket.username,
        users: users
      });
    }

  });

});//End Socket.io


/* Server */
server.listen(PORT, () => {
  console.log(`[Node.js] server on port: ${PORT} \u2713 `.bgGreen)
});