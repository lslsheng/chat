var express = require('express');
var socket = require('socket.io');

// App setup
var app = express();
var server = app.listen(4000, function(){
    console.log('listening for requests on port 4000,');
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
        // console.log(data);
        io.sockets.emit('chat', data);
    });

    // Handle typing event
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });

    // Handle online event
    socket.on('online', function(data){
        set.add(data);
        io.sockets.emit('online', Array.from(set));
    });

    // Handle online event
    socket.on('offline', function(data){
        set.delete(data);
        io.sockets.emit('online', Array.from(set));
    });

});
