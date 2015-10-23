var Tile = require('./tile');
var Player = require('./player');
var PlayerState = require('./player-state');
var dice = require('./dice');

function CartelGame() {
	this.tiles = [];
}

CartelGame.prototype.iteratePlayers = function(state, visitor) {
	for(var i=0;i<state.players.length;i++) {
		visitor(state.players[i]);
	}
}

CartelGame.prototype.getCurrentTileForPlayer = function(state, player) {
	return this.tiles[this.getStateForPlayer(state, player).position];
}

CartelGame.prototype.getStateForPlayer = function(state, player) {
	for (var i=0;i<state.positions.length;i++) {
		if (state.positions[i].player===player) {
			return state.positions[i];
		}
	}
}

CartelGame.prototype.canPurchaseTile = function(state, tile, player) {
	var isOwnedAlready = false;

	for(var i=0;i<state.players.length;i++) {
		var playerState = this.getStateForPlayer(state, state.players[i]);
		for (var j=0;j<playerState.ownedTiles.length;j++) {
			if (playerState.ownedTiles[j]===tile) {
				isOwnedAlready = true;
				break;
			}
		}
	}

	return (!isOwnedAlready && tile.purchasable && player.cash>tile.cost);
}

CartelGame.prototype.purchaseTile = function(state, tile,player) {
	var playerState = this.getStateForPlayer(state, player);
	playerState.add(tile);
	playerState.player.cash -= tile.cost;
}

CartelGame.prototype.next = function(state) {

	var result = [];

	// TODO: rename either the module or the variable to avoid confusion
	var diceValues = dice.roll();

	var diceValue = diceValues[0] + diceValues[1];

	for (var i=0;i<diceValue;i++) {
		// move one forward
		state.positions[state.playerIndex].position += 1;

		// reset to position zero
		if (state.positions[state.playerIndex].position == this.tiles.length) {
			state.positions[state.playerIndex].position = 0;
		} 

		//does the tile have a value when landing
		var index = state.positions[state.playerIndex].position;
		if (this.tiles[index].visitingValue) {
			state.positions[state.playerIndex].player.cash += 200;
		}
	}

	// move to the next player
	state.playerIndex++;
	if (state.playerIndex == state.players.length) {
		state.playerIndex = 0;
	}

	// push results
	result.push({'dice': diceValues});

	return result;
}

CartelGame.prototype.test = function() {

	this.iteratePlayers(
		state,
		function(player) {
			console.log(player.name);
		}
	);
}

module.exports = CartelGame;