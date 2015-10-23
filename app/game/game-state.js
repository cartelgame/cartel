var extend = require('extend');
var PlayerState = require('./player-state');

function GameState(params) {
	this.players = [];
	this.positions = [];
	this.playerIndex = 0;

	extend(this, params);

	// Add start positions
	for (var i=0;i<this.players.length;i++) {
		this.positions.push(new PlayerState(this.players[i], 0));
	}
}

module.exports = GameState;