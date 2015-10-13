var socketioJwt = require('socketio-jwt');
var securityConfig = require('../config/security');
var Game = require('./models/game');
var _ = require('lodash');

module.exports = function(http) {

	var io = require('socket.io')(http);

	// set authorization for socket.io
	io.sockets
		.on('connection', socketioJwt.authorize({
		    secret: securityConfig.secret,
		    timeout: 15000 // 15 seconds to send the authentication message
		})).on('authenticated', function(socket) {
		    //this socket is authenticated, we are good to handle more events from it.
		    console.log('hello! ' + socket.decoded_token);

		    socket.on('joined', function(user) {
		    	console.log("%s joined", user);
		    });

		    socket.on('chat message', function(message) {
		    	console.log(message);
		    	// TODO: get the game
		    	// TODO: add message to game
		    	var gameMessage = {
		    		name: socket.decoded_token, 
		    		message: message.message
		    	}
		    	Game.findByIdAndUpdate(
		    		message.game,
		    		{$push: {chatHistory: {name: socket.decoded_token, message: message.message}}},
		    		{new: true},
		    		function(err, model) {
		    			if (err) {
		    				console.log(err);
		    				return;
		    			}
		    			console.log(model.chatHistory);
		    			// Emit the message to everyone else
		    			io.emit('chat message', _.last(model.chatHistory));
		    		}
		    	);
		    });
		});
}
