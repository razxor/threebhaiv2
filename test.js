// Setup basic express server
/*var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3333;

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});
*/
var express        = require('express');
var fs = require('fs');
var app            = express();

var  dir = __dirname + "/public/files/thumb/";
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
server.listen(8344, function(err) { //'listening' listener
    if(!err){
        console.log('server is connected on port 8344.');
    }else{
        console.log(err)
    }
});
// Routing
//app.use(express.static(__dirname + '/public'));
//var chat = io.of('/chat');
io.on('connection', function (socket) {
    //console.log(socket)
    socket.on('connect', function(data) {
        console.log(data)
        socket.emit('connect', data);
    })
})