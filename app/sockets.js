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
		    var user = socket.decoded_token;

		    console.log("%s connected", user.username);

		    socket.on('join', function(gameId) {
		    	console.log("%s joined", user.username);
		    	// TODO: check whether user is allowed in the game
		    	socket.room = gameId;
		    	socket.join(gameId);
		    	socket.broadcast.to(socket.room).emit('player-joined', user.username);
		    });

		    socket.on('game-deleted', function() {
		    	console.log("Socket message received: game-deleted");
		    	console.log("Broadcasting socket message: game-deleted");
		    	socket.broadcast.to(socket.room).emit('game-deleted');
		    });

		    socket.on('start-game', function() {
		    	
		    	GameState.findOneAndUpdate(
		    		// Must include owner here as only owners can kick
		    		{ _id: socket.room, owner: user.username },
		    		// Remove the player
		    		{ started: true },
		    		// Return the new modified object
		    		{ new: true },
		    		function(err, game) {
		    			if (err) throw err;
		    			// Tell everyone else that the game has started
		    			socket.broadcast.to(socket.room).emit('game-started');
		    		}
		    	);
		    });

		    socket.on('chat-message', function(message) {
		    	console.log(message);
		    	var gameMessage = {
		    		playerName: user.username, 
		    		message: message.message
		    	}
		    	// Update the game object to add the new message
		    	GameState.findByIdAndUpdate(
		    		message.game,
		    		{ $push: { chatHistory: gameMessage } },
		    		{ new: true },
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
		    	console.log("Socket: %s kick player %s", user.username, playerName);
		    	console.log('Kicking player ' + playerName)

		    	GameState.findOneAndUpdate(
		    		// Must include owner here as only owners can kick
		    		{ _id: socket.room, owner: user.username },
		    		// Remove the player
		    		{ $pull: { playerStates: { name: playerName }}},
		    		// Return the new modified object
		    		{ new: true },
		    		function(err, game) {
		    			if (err) throw err;

		    			console.log(game);

		    			console.log('Broadcasting player kicked message');
		    			socket.broadcast.to(socket.room).emit('player-kicked', playerName);
		    		}
		    	);
		    });

		    socket.on('disconnect', function() {
		    	console.log("Socket: %s disconnected", user.username);

		    	GameState.findOneAndUpdate(
		    		// Must include owner here as only owners can kick
		    		// Only remove a player if the game hasn't started
		    		{ _id: socket.room, started: false },
		    		// Remove the player from the game
		    		{ $pull: { playerStates: { name: user.username }}},
		    		// Return the new modified object
		    		{ new: true },
		    		function(err, game) {
		    			if (err) throw err;

		    			console.log("Broadcasting socket message: player-disconnected %s", user.username);
		    			socket.broadcast.to(socket.room).emit('player-disconnected', user.username);
		    		}
		    	);
		    });
		});
}
