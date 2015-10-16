var socketioJwt = require('socketio-jwt');
var securityConfig = require('../config/security');
var Game = require('./models/game');
var _ = require('lodash');

module.exports = function(http) {

	var io = require('socket.io')(http);

	// set authorization for socket.io
	// TODO: figure out how to send messages only to players in game
	io.sockets
		.on('connection', socketioJwt.authorize({
		    secret: securityConfig.secret,
		    timeout: 15000 // 15 seconds to send the authentication message
		})).on('authenticated', function(socket) {
		    //this socket is authenticated, we are good to handle more events from it.

		    socket.on('join', function(gameId) {
		    	console.log("%s joined", socket.decoded_token);
		    	// TODO: check whether user is allowed in the game
		    	socket.room = gameId;
		    	socket.join(gameId);
		    });

		    socket.on('chat-message', function(message) {
		    	console.log(message);
		    	var gameMessage = {
		    		name: socket.decoded_token, 
		    		message: message.message
		    	}
		    	// Update the game object to add the new message
		    	Game.findByIdAndUpdate(
		    		message.game,
		    		{$push: {chatHistory: gameMessage}},
		    		{new: true},
		    		function(err, model) {
		    			if (err) {
		    				console.log(err);
		    				return;
		    			}
		    			console.log(model.chatHistory);
		    			// Emit the message to everyone else
		    			socket.broadcast.to(socket.room).emit('chat-message', _.last(model.chatHistory));
		    		}
		    	);
		    });

		    socket.on('player-ready', function(data) {
		    	console.log("%s %s", socket.decoded_token, data.ready ? 'ready' : 'not ready');

		    	var username = socket.decoded_token;

		    	Game.findOneAndUpdate(
		    		{_id: data.game, 'players.name': username},
		    		{'$set': {
		    			'players.$.ready': data.ready // TODO: why do I have to invert this!?!?!
		    		}},
		    		{new: true},
		    		function(err, game) {
		    			console.log(game.players);

		    			// Tell other players we've changed our state
				    	socket.broadcast.to(socket.room).emit('player-ready', {
				    		name: socket.decoded_token,
				    		ready: data.ready
				    	});
		    		}
		    	);

		    	
		    });
		});
}
