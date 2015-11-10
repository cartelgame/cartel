var dice = require('./dice');
var GameState = require('../models/game-state');

// Private functions
var iteratePlayers = function(state, visitor) {
	for(var i=0;i<state.players.length;i++) {
		visitor(state.players[i]);
	}
}

var test = function() {

	this.iteratePlayers(
		state,
		function(player) {
			console.log(player.name);
		}
	);
}

// Public functions
module.exports = {
	roll: function(state) {
		if (state.turnState != 0) {
			// Can't roll if we're in the wrong state
			return;
		}

		var result = [];
		var tiles = state.tileset.tiles;

		var diceValues = dice.roll();

		var diceValue = diceValues[0] + diceValues[1];

		for (var i = 0; i < diceValue; i++) {
			// move one forward
			state.playerStates[state.playerIndex].position += 1;

			// reset to position zero
			if (state.playerStates[state.playerIndex].position == tiles.length) {
				state.playerStates[state.playerIndex].position = 0;
			}

			//does the tile have a value when landing
			var index = state.playerStates[state.playerIndex].position;
			if (tiles[index].visitingValue) {
				state.playerStates[state.playerIndex].cash += 200;
			}
		}

		// move to the next player
		// state.playerIndex++;
		// if (state.playerIndex == state.playerStates.length) {
		// 	state.playerIndex = 0;
		// }

		// Update
		state.turnState = GameState.TURN_END;

		// push results
		result.push({'dice': diceValues});

		return result;
	},

	endTurn: function(state) {
		state.turnState = GameState.TURN_START;
		// move to the next player
		state.playerIndex++;
		if (state.playerIndex == state.playerStates.length) {
			state.playerIndex = 0;
		}
	},

	getStateForPlayer: function(state, player) {
		for (var i = 0; i < state.playerStates.length; i++) {
			if (state.playerStates[i].player === player.name) {
				return state.playerStates[i];
			}
		}
	},

	// TODO: this method should exist on GameState
	getCurrentTileForPlayer: function(state, player) {
		var tiles = state.tileset.tiles;
		return tiles[this.getStateForPlayer(state, player).position];
	},

	// TODO: this method should exist on GameState
	canPurchaseTile: function(state, tileIndex, playerState) {
		var isOwnedAlready = false;
		var tile = state.tileset.tiles[tileIndex];

		for (var i = 0; i < state.playerStates.length; i++) {
			var otherPlayerState = state.playerStates[i];
			for (var j = 0; j < otherPlayerState.ownedTiles.length; j++) {
				if (otherPlayerState.ownedTiles[j] === tileIndex) {
					isOwnedAlready = true;
					break;
				}
			}
		}

		return (!isOwnedAlready && tile.purchasable && playerState.cash > tile.cost);
	},

	purchaseTile: function(state, tile, playerState) {
		playerState.add(tile);
		playerState.cash -= tile.cost;
	}
};