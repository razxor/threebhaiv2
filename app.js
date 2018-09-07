//var io = require('socket.io').listen(3333);

var express = require('express');
var fs = require('fs');
var app = express();

var dir = __dirname + "/public/files/thumb/";
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chat', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

//server.listen(3334);
server.listen(8888, function (err) { //'listening' listener
    if (!err) {
        console.log('server is connected on port 8888.');
    } else {
        console.log(err)
    }
});
var chat = io.of('/chat');
var users = {};

io.on('connection', function (socket) {
    console.log("Connected");
    //console.log(socket)
    //app open
    socket.on('login', function (data) {
//        console.log(data);
        var username = data;
        users[username] = socket;
        socket.emit('login_ack', {success : true, 'msg': 'Logged in successfully.'});
    });
    //click yes or no
    socket.on('msg', function (data) {
        var to = data.passenger_id;
        console.log(users)
        console.log(to)
        if (users[to])
            users[to].emit('received_or_not_call', data);     // Receive in passenger ap
            socket.emit('msg_ack', {success : true, 'msg': 'You have send successfully.'});
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
        // iterate over users object and get the username for disconnecting socket.id
        for (username in users) {
            if (users[username] == socket) {
                delete(users[username]);
                break;
            }
            ;
        }

    });
});
function extend(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;
}