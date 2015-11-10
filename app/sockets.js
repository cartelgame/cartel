var socketioJwt = require('socketio-jwt');
var securityConfig = require('../config/security');
var GameState = require('./models/game-state');
var TileSet = require('./models/tileset');
var CartelGame = require('./game/cartel-game');
var _ = require('lodash');

function handlePlayerDisconnectedGame(socket) {
	return function() {
		console.log("Socket: %s disconnected", socket.user.username);

		GameState.findOneAndUpdate(
			// Must include owner here as only owners can kick
			// Only remove a player if the game hasn't started
			{ _id: socket.room, started: false },
			// Remove the player from the game
			{ $pull: { playerStates: { name: socket.user.username }}},
			// Return the new modified object
			{ new: true },
			function(err, game) {
				if (err) throw err;

				console.log("Broadcasting socket message: player-disconnected %s", socket.user.username);
				socket.broadcast.to(socket.room).emit('player-disconnected', socket.user.username);
			}
		);
	}
}

function handlePlayerDisconnectedLobby(socket) {
	return function() {
		console.log("Socket: %s disconnected", socket.user.username);

		GameState.findOneAndUpdate(
    		{_id: gameId, started: true, 'playerStates.name': socket.user.username}, 
    		{'$set': {
    			'playerStates.$.available': false
    		}},
    		function(err, game) {
    		if (err) {
    			throw err;
    		}

    		if (game) {
    			console.log("Broadcasting socket message: player-disconnected %s", socket.user.username);
		    	socket.broadcast.to(socket.room).emit('player-disconnected', socket.user.username);
    		}
    	});
	}
}

function handleStartGame(socket) {
	return function() {
		GameState.findOneAndUpdate(
    		// Must include owner here as only owners can kick
    		{ _id: socket.room, owner: socket.user.username },
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
    }
}

function handleGameDeleted(socket) {
	return function() {
		console.log("Socket message received: game-deleted");
    	console.log("Broadcasting socket message: game-deleted");
    	socket.broadcast.to(socket.room).emit('game-deleted');
	}
}

function handleChatMessage(socket) {
	return function(message) {
		console.log(message);
    	var gameMessage = {
    		playerName: socket.user.username, 
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
	}
}

function handlePlayerReady(socket) {
	return function(data) {
    	console.log("%s %s", socket.user.username, data.ready ? 'ready' : 'not ready');

    	GameState.findOneAndUpdate(
    		{_id: data.game, 'playerStates.name': socket.user.username},
    		{'$set': {
    			'playerStates.$.ready': data.ready
    		}},
    		{new: true},
    		function(err, game) {
    			if (err) throw err;
    			console.log(game.playerStates);

    			// Tell other players we've changed our state
		    	socket.broadcast.to(socket.room).emit('player-ready', {
		    		name: socket.user.username,
		    		ready: data.ready
		    	});
    		}
    	);
    }
}

function handleKickPlayer(socket) {
	return function(playerName) {
    	console.log("Socket: %s kick player %s", socket.user.username, playerName);
    	console.log('Kicking player ' + playerName)

    	GameState.findOneAndUpdate(
    		// Must include owner here as only owners can kick
    		{ _id: socket.room, owner: socket.user.username },
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
    }
}

function handleRoll(io, socket) {
	return function() {
		// TODO: use waterfall
		GameState.findOne({_id: socket.room, started: true, 'playerStates.name': socket.user.username})
			.populate('tileset')
			.exec(function(err, game) {
	    		if (err) {
	    			throw err;
	    		}

	    		if (game) {
	    			// TileSet.findOne({_id: game.tileset}, function(err, tileset) {
	    			// 	if (err) {
	    			// 		throw err;
	    			// 	}
	    				console.log(game);
	    				CartelGame.roll(game);
	    				game.save(function(err) {
	    					io.sockets.in(socket.room).emit('state-updated', game);
		    				// socket.to(socket.room).emit('state-updated', game);
		    			});
	    			// });
	    		}
	    	});
	}
}

function handleEndTurn(io, socket) {
	return function() {
		// TODO: use waterfall
		GameState.findOne({_id: socket.room, started: true, 'playerStates.name': socket.user.username})
			.populate('tileset')
			.exec(function(err, game) {
	    		if (err) {
	    			throw err;
	    		}

	    		if (game) {
	    			CartelGame.endTurn(game);
    				game.save(function(err) {
    					io.sockets.in(socket.room).emit('state-updated', game);
	    				// socket.to(socket.room).emit('state-updated', game);
	    			});
	    		}
	    	});
	}
}

module.exports = function(http) {
	var io = require('socket.io')(http);

	// set authorization for socket.io
	io.sockets
		.on('connection', socketioJwt.authorize({
		    secret: securityConfig.secret,
		    timeout: 15000 // 15 seconds to send the authentication message
		})).on('authenticated', function(socket) {
		    //this socket is authenticated, we are good to handle more events from it.
		    socket.user = socket.decoded_token;

		    console.log("%s connected", socket.user.username);

		    // Listen for when the user enters the game lobby
		    socket.on('lobby-enter', function(gameId) {
		    	console.log("%s entered lobby for game %s", socket.user.username, gameId);
		    	// TODO: check whether user is allowed in the game
		    	socket.room = gameId;
		    	socket.join(gameId);
		    	socket.broadcast.to(socket.room).emit('player-joined', socket.user.username);

		    	// Listen for lobby-related messages
		    	socket.on('disconnect', handlePlayerDisconnectedLobby(socket));
		    	socket.on('game-deleted', handleGameDeleted(socket));
		    	socket.on('start-game', handleStartGame(socket));
		    	socket.on('chat-message', handleChatMessage(socket));
		    	socket.on('player-ready', handlePlayerReady(socket));
		    	socket.on('kick-player', handleKickPlayer(socket));
		    });	

		    // Listen for when the player enters the game
		    // Players send 'play-available' when they connect to a game that's started
		    socket.on('player-available', function(gameId) {
		    	console.log("Socket message received: %s available", socket.user.username);
		    	// Find the game and set the player's status to available
		    	GameState.findOneAndUpdate(
		    		{_id: gameId, started: true, 'playerStates.name': socket.user.username}, 
		    		{'$set': {
		    			'playerStates.$.available': true
		    		}},
		    		function(err, game) {
		    		if (err) {
		    			throw err;
		    		}

		    		if (game) {
		    			// Got the game and the user is in it
		    			console.log("Socket broadcasting (%s): %s available", gameId, socket.user.username);
		    			socket.room = gameId;
				    	socket.join(gameId);
				    	socket.broadcast.to(socket.room).emit('player-available', socket.user.username);
		    		}
		    	});

		    	// Listen for game-related messages
		    	socket.on('game-deleted', handleGameDeleted(socket));
		    	socket.on('chat-message', handleChatMessage(socket));
		    	socket.on('disconnect', handlePlayerDisconnectedGame(socket));
		    	socket.on('roll', handleRoll(io, socket));
		    	socket.on('end-turn', handleEndTurn(io, socket));
		    });

		    	    
		});
}
