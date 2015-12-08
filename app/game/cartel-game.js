var dice = require('./dice');
var GameState = require('../models/game-state');
var _ = require('lodash');

// Private functions
var iteratePlayers = function(state, visitor) {
	for(var i=0;i<state.players.length;i++) {
		visitor(state.players[i]);
	}
}

// Public functions
module.exports = {
	roll: function(state, overrideDice) {
		if (state.turnState != 0) {
			// Can't roll if we're in the wrong state
			return;
		}

		var result = [];
		var tiles = state.tileset.tiles;

		var diceValues = (overrideDice) ? overrideDice.roll() : dice.roll();

		var diceValue = diceValues[0] + diceValues[1];

		var playerState = state.playerStates[state.playerIndex];

		for (var i = 0; i < diceValue; i++) {
			// move one forward
			playerState.position += 1;

			// reset to position zero
			if (playerState.position == tiles.length) {
				playerState.position = 0;
			}

			//does the tile have a value when landing
			var index = playerState.position;
			if (tiles[index].visitingValue) {
				playerState.cash += 200;
			}
		}

		// TODO: get final position
		// TODO: check if the tile is owned by another player and charge accordingly
		var owner = state.getTileOwner(playerState.position);
		if (owner && owner.name != playerState.name) {
			var rent = this.getRentValue(state, playerState.position);
			playerState.cash -= rent;
		}

		// Update
		state.turnState = GameState.TURN_END;

		// push results
		result.push({'dice': diceValues});

		return result;
	},

	endTurn: function(state) {
		// Can't change state if 
		if (state.turnState == GameState.TURN_START) {
			return;
		}
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

	// TODO: this method should exist on GameState?
	getCurrentTileForPlayer: function(state, player) {
		var tiles = state.tileset.tiles;
		return tiles[this.getStateForPlayer(state, player).position];
	},

	// TODO: this method should exist on GameState?
	canPurchaseTile: function(state, playerState, tileIndex) {
		var playerState = (playerState) ? playerState : state.playerStates[state.playerIndex];
		var tileIndex = (tileIndex) ? tileIndex : playerState.position;
		
		var currentOwner = state.getTileOwner(tileIndex);
		var tile = state.tileset.tiles[tileIndex];

		return (!currentOwner && tile.purchasable && playerState.cash > tile.cost);
	},

	purchaseTile: function(state, playerState, tileIndex) {
		var playerState = (playerState) ? playerState : state.playerStates[state.playerIndex];
		var tileIndex = (tileIndex) ? tileIndex : playerState.position;

		playerState.ownedTiles.push({index: tileIndex});
		playerState.cash -= state.tileset.tiles[tileIndex].cost;
	},

	getRentValue: function(state, tileIndex) {
		var owner = state.getTileOwner(tileIndex);
		var ownedTile = _.find(owner.ownedTiles, {index: tileIndex});

		if (!ownedTile) {
			return 0;
		}

		var tile = state.tileset.tiles[tileIndex];

		if (ownedTile.hotel == true) {
			// Has a hotel
			return tile.rents[4];
		} else {
			// Has no house or houses
			return tile.rents[ownedTile.houses];
		}
	}
};