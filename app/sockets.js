var socketioJwt = require('socketio-jwt');
var securityConfig = require('../config/security');
var GameState = require('./models/game-state');
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
		    console.log("new socket!");

		    socket.on('join', function(gameId) {
		    	var user = socket.decoded_token;
		    	console.log("%s joined", user.username);
		    	// TODO: check whether user is allowed in the game
		    	socket.room = gameId;
		    	socket.join(gameId);
		    	socket.broadcast.to(socket.room).emit('player-joined', user.username);
		    });

		    socket.on('game-deleted', function() {
		    	socket.broadcast.to(socket.room).emit('game-deleted');
		    });

		    socket.on('chat-message', function(message) {
		    	console.log(message);
		    	var user = socket.decoded_token;
		    	var gameMessage = {
		    		playerName: user.username, 
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
		    	var user = socket.decoded_token;
		    	console.log("%s %s", user.username, data.ready ? 'ready' : 'not ready');

		    	GameState.findOneAndUpdate(
		    		{_id: data.game, 'playerStates.name': user.username},
		    		{'$set': {
		    			'playerStates.$.ready': data.ready
		    		}},
		    		{new: true},
		    		function(err, game) {
		    			if (err) throw err;
		    			console.log(game.playerStates);

		    			// Tell other players we've changed our state
				    	socket.broadcast.to(socket.room).emit('player-ready', {
				    		name: user.username,
				    		ready: data.ready
				    	});
		    		}
		    	);
		    });

		    socket.on('kick-player', function(playerName) {
		    	var user = socket.decoded_token;
		    	console.log('Kicking player ' + playerName)
		    	GameState.findOne({_id: socket.room, owner: user.username }, function(err, game) {
		    		console.log('Found game');
		    		// If we found a game then the socket's owner is the owner of the game
		    		// and has the right to kick players
		    		game.playerStates.pull({name: playerName});

		    		console.log('Broadcasting player kicked message');
		    		socket.broadcast.to(socket.room).emit('player-kicked', playerName);
		    	});
		    });
		});
}
