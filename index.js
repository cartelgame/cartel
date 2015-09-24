var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/pages/index.html');
});

app.use(express.static('public'));
app.use(express.static('bower_components'));

io.on('connection', function(socket){
  console.log(socket);
  console.log('a user connected');
  io.emit('connection message', "User connected");

  socket.on('disconnect', function(){
    console.log('user disconnected');
    io.emit('connection message', "User disconnected");
  });
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });
});

http.listen(3000, '0.0.0.0', function(){
  console.log('listening on *:3000');
});