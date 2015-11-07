var express = require('express');
var app = express();
var http = require('http').Server(app);
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');
var TileSet = require('./app/models/tileset')

var configDB = require('./config/database.js');

mongoose.connect(configDB.url);

// Setup defaut tileset
async.waterfall([
	function(callback) {
		// TileSet.findOne({name: 'default'}, function(err, tileset) {
		// 	if (err) {
		// 		throw err;
		// 	}
		// 	if (tileset) {
		// 		console.log("Default tileset already exists");
		// 		return callback(null, false);
		// 	} else {
				TileSet.remove({}, function() {
					console.log("Cleared tilesets");
					callback(null, true);
				});
		// 	}
		// })
	},
	function(addTileset, callback) {
		if (!addTileset) {
			return callback();
		} else {
			var tileset = new TileSet({
			name: "default",
				tiles: [
					{name: 'a', visitingValue: 200, purchasable: false},
					{name: 'b', purchasable: true, cost: 100, group: 'a'},
					{name: 'c', purchasable: true, cost: 200, group: 'a'},
					{name: 'd', purchasable: true, cost: 200, group: 'a'},
					{name: 'e', purchasable: true, cost: 200, group: 'b'},
					{name: 'f', purchasable: true, cost: 200, group: 'b'},
					{name: 'g', purchasable: true, cost: 100, group: 'b'},
					{name: 'h', purchasable: true, cost: 200, group: 'c'},
					{name: 'i', purchasable: true, cost: 200, group: 'c'},
					{name: 'j', purchasable: true, cost: 200, group: 'c'},
					{name: 'k', purchasable: true, cost: 200, group: 'd'},
					{name: 'l', purchasable: true, cost: 200, group: 'd'},
					{name: 'm', purchasable: true, cost: 100, group: 'd'},
					{name: 'n', purchasable: true, cost: 200, group: 'e'},
					{name: 'o', purchasable: true, cost: 200, group: 'e'},
					{name: 'p', purchasable: true, cost: 200, group: 'e'},
					{name: 'q', purchasable: true, cost: 100, group: 'f'},
					{name: 'r', purchasable: true, cost: 200, group: 'f'},
					{name: 's', purchasable: true, cost: 200, group: 'f'},
					{name: 't', purchasable: true, cost: 200, group: 'f'},
					{name: 'u', purchasable: true, cost: 200, group: 'f'},
					{name: 'v', purchasable: true, cost: 200, group: 'f'},
					{name: 'w', purchasable: true, cost: 200, group: 'f'},
					{name: 'x', purchasable: true, cost: 200, group: 'f'},
					{name: 'y', purchasable: true, cost: 200, group: 'f'},
					{name: 'z', purchasable: true, cost: 200, group: 'f'},
					{name: 'aa', purchasable: true, cost: 200, group: 'f'},
					{name: 'ab', purchasable: true, cost: 200, group: 'f'},
					{name: 'ac', purchasable: true, cost: 200, group: 'f'},
					{name: 'ad', purchasable: true, cost: 200, group: 'f'},
					{name: 'ae', purchasable: true, cost: 200, group: 'f'},
					{name: 'af', purchasable: true, cost: 200, group: 'f'},
					{name: 'ag', purchasable: true, cost: 200, group: 'f'},
					{name: 'ah', purchasable: true, cost: 200, group: 'f'},
					{name: 'ai', purchasable: true, cost: 200, group: 'f'},
					{name: 'aj', purchasable: true, cost: 200, group: 'f'},
					{name: 'ak', purchasable: true, cost: 200, group: 'f'},
					{name: 'al', purchasable: true, cost: 200, group: 'f'},
					{name: 'am', purchasable: true, cost: 200, group: 'f'},
					{name: 'an', purchasable: true, cost: 200, group: 'f'}
				]
			});

			tileset.save(function() {
				console.log("Saved tileset " + tileset);
				callback();
			});
		}
	}
]);

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.use(passport.initialize());

// Static things
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(express.static('client'));

// Routes
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