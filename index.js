var express = require('express'),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	session = require('express-session');

var app = express();

var Session = require('express-session'),
    SessionStore = require('session-file-store')(Session);
    session = Session({
      store: new SessionStore({ path: './tmp/sessions' }),
      secret: 'pass',
      resave: true,
      saveUninitialized: true
    });

app.use(session({
	secret:'pass',
	resave: true,
	saveUninitialized: true
}));

io.use(function(socket, next) {
	session(socket.handshake, {}, next);
});

app.get('/', function(req, res){
	res.sendFile(__dirname + '/pages/index.html');
});

app.use(express.static('public'));
app.use(express.static('bower_components'));

io.on('connection', function(socket){
	// console.log("Session: ", socket.handshake.session);
	// console.log(socket);
	console.log('a user connected');
	io.emit('connection message', "User connected");

	socket.on('disconnect', function(){
		console.log('user disconnected');
		io.emit('connection message', "User disconnected");
	});
	
	socket.on('chat message', function(msg){
		console.log('message: ' + socket.handshake.session.uid + " - " + msg.message);
		io.emit('chat message', msg);
	});
});

app.listen(3000, '0.0.0.0', function(){
	console.log('listening on *:3000');
});