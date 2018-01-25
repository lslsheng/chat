var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(80, function(){
    console.log('listening for requests on port 80,');
});

var set = new Set();

// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('chat', function(data){
        console.log(data);
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        console.log(data);
        socket.broadcast.emit('typing', data);
    });

    // Handle online event
    socket.on('online', function(data){
        console.log(data);
        set.add(data);
        io.sockets.emit('online', Array.from(set));
    });

    // Handle online event
    socket.on('offline', function(data){
        console.log(data);
        set.delete(data);
        io.sockets.emit('online', Array.from(set));
    });

});
