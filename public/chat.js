// Make connection
var socket = io.connect('http://localhost:4000');

// Query DOM
var message = document.getElementById('message'),
      handle = document.getElementById('handle'),
      btn = document.getElementById('send'),
      output = document.getElementById('output'),
      online = document.getElementById('online'),
      chatwindow = document.getElementById('chat-window');
      feedback = document.getElementById('feedback');

message.addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        btn.click();
    }
});

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value
    });
    socket.emit('online', handle.value);
    message.value = "";
});

message.addEventListener('keypress', function(){
    socket.emit('typing', handle.value);
})

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '';
    document.title = 'New Message';
    output.innerHTML += '<p><strong>' + data.handle + ': </strong>' + data.message + '</p>';
    chatwindow.scrollTop = chatwindow.scrollHeight;
});

// Listen for online
socket.on('online', function(data){
    online.innerHTML = '<p><em>' + data + ' is online</em></p>';
});

socket.on('typing', function(data){
    feedback.innerHTML = '<p><em>' + data + ' is typing a message...</em></p>';
});

function unload() {
  socket.emit('offline', handle.value);
}
