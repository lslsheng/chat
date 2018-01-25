// Make connection
var socket = io.connect('http://localhost:5000/');

// Query DOM
var message = document.getElementById('message'),
      id = document.getElementById('name'),
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
    if (message.value == null || message.value == '')
      return;
    socket.emit('chat', {
        message: message.value,
        id: id.value
    });
    socket.emit('online', id.value);
    message.value = "";
});

message.addEventListener('keypress', function(){
    blinkTitleStop()
    document.title = 'Sheng Chat';
    socket.emit('typing', id.value);
})

// Listen for events
socket.on('chat', function(data){
    feedback.innerHTML = '    ';
    blinkTitle("Head's Up","New Message",500, true);
    output.innerHTML += '<p><strong>' + data.id + ': </strong>' + data.message + '</p>';
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
  socket.emit('offline', id.value);
}

var hold = "";



function blinkTitle(msg1, msg2, delay, isFocus, timeout) {
    if (isFocus == null) {
        isFocus = false;
    }
    if (timeout == null) {
        timeout = false;
    }
    if(timeout){
        setTimeout(blinkTitleStop, timeout);
    }
    document.title = msg1;
    if (isFocus == false) {
        hold = window.setInterval(function() {
            if (document.title == msg1) {
                document.title = msg2;
            } else {
                document.title = msg1;
            }

        }, delay);
    }

    if (isFocus == true) {
        var onPage = false;
        var testflag = true;
        var initialTitle = document.title;
        window.onfocus = function() {
            onPage = true;
        };
        window.onblur = function() {
            onPage = false;
            testflag = false;
        };
        hold = window.setInterval(function() {
            if (onPage == false) {
                if (document.title == msg1) {
                    document.title = msg2;
                } else {
                    document.title = msg1;
                }
            }
        }, delay);
    }
}

function blinkTitleStop() {
    clearInterval(hold);
}