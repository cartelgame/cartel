var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var hash = require('./pass').hash;

var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our database

// set up our express application
// app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded());
app.use(session({
	secret: 'secret',
	key: 'express.sid',
	saveUninitialized: true,
	resave: true
}));

app.use(express.static('public'));
app.use(express.static('bower_components'));

// dummy database

var users = {
	tj: { name: 'tj' }
};

function restrict(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.session.error = 'Access denied!';
		req.session.returnTo = req.path;
		res.redirect('/login');
	}
}

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

hash('foobar', function(err, salt, hash){
	if (err) throw err;
	// store the salt & hash in the "db"
	users.tj.salt = salt;
	users.tj.hash = hash.toString();
});

function authenticate(name, pass, fn) {
	if (!module.parent) console.log('authenticating %s:%s', name, pass);
	var user = users[name];
	// query the db for the given username
	if (!user) return fn(new Error('cannot find user'));
	// apply the same algorithm to the POSTed password, applying
	// the hash against the pass / salt, if there is a match we
	// found the user
	hash(pass, user.salt, function(err, hash){
		if (err) return fn(err);
		if (hash.toString() == user.hash) return fn(null, user);
		fn(new Error('invalid password'));
	})
}

app.get('/', restrict, function(req, res){
  	res.sendfile('pages/index.html');
});

app.get('/login', function(req, res){
  	res.sendfile('pages/login.html');
});

app.post('/login', function(req, res){
	authenticate(req.body.username, req.body.password, function(err, user){
		if (user) {
			// Regenerate session when signing in
			// to prevent fixation
			req.session.regenerate(function(){
				// Store the user's primary key
				// in the session store to be retrieved,
				// or in this case the entire user object
				req.session.user = user;
				req.session.success = 'Authenticated as ' + user.name
					+ ' click to <a href="/logout">logout</a>. '
					+ ' You may now access <a href="/restricted">/restricted</a>.';
				var returnTo = req.session.returnTo ? req.session.returnTo : '/';
				delete req.session.returnTo;
				//is authenticated ?
				res.redirect(returnTo);
			});
		} else {
			req.session.error = 'Authentication failed, please check your '
				+ ' username and password.'
				+ ' (use "tj" and "foobar")';
			res.redirect('login');
		}
	});
});


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