var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var ios = require('socket.io-express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

// set up our express application
// app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

// TODO: remove this when tokens work - we won't be using sessions
var sessionMiddleware = session({
	secret: 'secret',
	key: 'express.sid',
	saveUninitialized: true,
	resave: true
});

app.use(sessionMiddleware);
app.use(passport.initialize());
// TODO: remove this when tokens work - we won't be using sessions
app.use(passport.session());

// Static things
app.use(express.static('public'));
app.use(express.static('bower_components'));

app.use('/', require('./app/routes.js'))

// passport config
var User = require('./app/models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// TODO: remove this when tokens work - we won't be using sessions
io.use(ios(sessionMiddleware));

io.use(function(socket, next) {
	// deny connection if there is no valid session
	// TODO: is this the right way to do this?
	// TODO: remove this when tokens work - we won't be using sessions
	if (!socket.handshake.session.passport) {
		next("Auth error");
	} else {
		next();
	}
});

io.on('connection', function(socket){
	console.log(socket.handshake.session);
	var username = socket.handshake.session.passport.user;
	console.log(username + ' connected');
	io.emit('connection message', "User connected");

	socket.on('disconnect', function(){
		console.log('user disconnected');
		io.emit('connection message', "User disconnected");
	});

	socket.on('chat message', function(msg){
		console.log('message: ' + username + " - " + msg);
		io.emit('chat message', {
			user: username,
			message: msg
		});
	});
});

http.listen(3000, function(){
  	console.log('listening on *:3000');
});