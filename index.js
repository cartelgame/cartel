var express = require('express');
var app = express();
var http = require('http').Server(app);
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
app.use(express.static('client'));

app.use('/', require('./app/routes.js'))
app.use('/api', require('./app/apiRoutes.js'))

// passport config
var User = require('./app/models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setup socket stuff
require('./app/sockets')(http);

http.listen(3000, function(){
  	console.log('listening on *:3000');
});