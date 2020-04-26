
$(document).ready(function () {

  const socket = io();

  /* Add new user  */
  $('#login-form').submit(event => {
    event.preventDefault();
    socket.emit('add user', $('#usr').val().trim());
    $('#usr').val('');
    online = true;
    return false;
  });

  /* Login */
  socket.on('login', data => {
    $('#login-room').hide();
    $('#sign-users, #chat-room').show();
    $('#login-room').off('click');
    $('#sign-users').text('Users online ' + data.users);

    $('#sign-welcome').text(`Welcome to Socket.io chat room ${data.username}`)
      .show();

    setTimeout(() => {
      $('#sign-welcome').fadeOut();
    }, 6000);

  });

  /* User joined */
  socket.on('user joined', data => {
    $('#sign-activity').text(`${data.username} has joined the chat`)
      .removeClass('badge-danger')
      .addClass('badge-success')
      .show();
    $('#sign-users').text('Users online ' + data.users);
    setTimeout(() => {
      $('#sign-activity').fadeOut();
    }, 4000);
  });

  /* User left */
  socket.on('user left', data => {
    $('#sign-activity')
      .text(`${data.username} has left the chat`)
      .removeClass('badge-success')
      .addClass('badge-danger')
      .show();
    $('#sign-users').text('Users online ' + data.users);
    setTimeout(() => {
      $('#sign-activity').fadeOut();
    }, 4000);
  });


  /* Sends the message to the server */
  $('#chat-form').submit(event => {
    event.preventDefault(); // Prevents page reloading
    socket.emit('new-msg', $('#msg').val());// Emits the input id: msg value
    $('#msg').val('');// Clears the input
    return false;// Ammm returns false
  });

  /* Appends the new message to the screen */
  socket.on('new-msg', data => {

    $('#messages').append($('<li>').append(`<strong>${data.username}</strong>: ${data.message}`));
    $(document).scrollTop($(document).height());
  });

});