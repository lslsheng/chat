var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(5000, function(){
    console.log('listening for requests on port 5000,');
});

var map = new Map();

// Static files
app.use(express.static('public'));

// Socket setup & pass server
var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);

    // Handle chat event
    socket.on('chat', function(data){
        console.log('chat' + data.toString());
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        console.log(data);
        socket.broadcast.emit('typing', data);
    });

    // Handle online event
    socket.on('online', function(data){
        console.log('online' + data);
        map.set(socket.id, data);
        io.sockets.emit('online', Array.from(map.values()));
    });

    // Handle offline event
    socket.on('offline', function(data){
        console.log(data);
        map.delete(socket.id);
        io.sockets.emit('online', Array.from(map.values()));
    });

});
