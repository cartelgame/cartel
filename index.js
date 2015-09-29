var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: 'secret',
	key: 'express.sid',
	saveUninitialized: true,
	resave: true
}));

// Static things
app.use(express.static('public'));
app.use(express.static('bower_components'));

app.use('/', require('./app/routes.js'))

io.on('connection', function(socket){
	console.log('a user connected');
	io.emit('connection message', "User connected");

	socket.on('disconnect', function(){
		console.log('user disconnected');
		io.emit('connection message', "User disconnected");
	});

	socket.on('chat message', function(msg){
		console.log('message: ' + msg.user + " - " + msg.message);
		io.emit('chat message', msg);
	});
});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});