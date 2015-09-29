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
	saveUninitialized: false,
	resave: false
}));
app.use(passport.initialize());
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