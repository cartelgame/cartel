var Tile = require('./tile');
var Player = require('./player');
var PlayerState = require('./player-state');
var dice = require('./dice');

function CartelGame() {

	this.state = {
		tiles: [],
		players: [],
		positions: [],
		playerIndex: 0
	};
}

CartelGame.prototype.iteratePlayers = function(visitor) {
	var state = this.state;

	for(var i=0;i<state.players.length;i++) {
		visitor(state.players[i]);
	}
}

CartelGame.prototype.getCurrentTileForPlayer = function(player) {
	var state = this.state;

	return state.tiles[this.getStateForPlayer(player).position];
}

CartelGame.prototype.getStateForPlayer = function(player) {
	var state = this.state;

	for (var i=0;i<state.positions.length;i++) {
		if (state.positions[i].player===player) {
			return state.positions[i];
		}
	}
}

CartelGame.prototype.canPurchaseTile = function(tile,player) {
	var state = this.state;

	var isOwnedAlready = false;

	for(var i=0;i<state.players.length;i++) {
		var playerState = this.getStateForPlayer(state.players[i]);
		for (var j=0;j<playerState.ownedTiles.length;j++) {
			if (playerState.ownedTiles[j]===tile) {
				isOwnedAlready = true;
				break;
			}
		}
	}

	return (!isOwnedAlready && tile.purchasable && player.cash>tile.cost);
}

CartelGame.prototype.purchaseTile = function(tile,player) {
	var state = this.state;
	var playerState = this.getStateForPlayer(player);
	playerState.add(tile);
	playerState.player.cash -= tile.cost;
}

CartelGame.prototype.next = function() {

	var result = [];

	var state = this.state;

	// TODO: rename either the module or the variable to avoid confusion
	var diceValues = dice.roll();

	var diceValue = diceValues[0] + diceValues[1];

	for (var i=0;i<diceValue;i++) {
		// move one forward
		state.positions[state.playerIndex].position += 1;

		// reset to position zero
		if (state.positions[state.playerIndex].position == state.tiles.length) {
			state.positions[state.playerIndex].position = 0;
		} 

		//does the tile have a value when landing
		var index = state.positions[state.playerIndex].position;
		if (state.tiles[index].visitingValue) {
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
		function(player) {
			console.log(player.name);
		}
	);
}

CartelGame.prototype.serialize = function() {
	return JSON.stringify(cartel.game.state);
}

CartelGame.prototype.init = function() {

	var state = this.state;

	state.tiles.push(
		new Tile({name:'a',visitingValue:200,purchasable:false}),
		new Tile({name:'b',purchasable:true,cost:100,group:'a'}),
		new Tile({name:'c',purchasable:true,cost:200,group:'a'}),
		new Tile({name:'d',purchasable:true,cost:200,group:'a'}),
		new Tile({name:'e',purchasable:true,cost:200,group:'b'}),
		new Tile({name:'f',purchasable:true,cost:200,group:'b'}),
		new Tile({name:'g',purchasable:true,cost:100,group:'b'}),
		new Tile({name:'h',purchasable:true,cost:200,group:'c'}),
		new Tile({name:'i',purchasable:true,cost:200,group:'c'}),
		new Tile({name:'j',purchasable:true,cost:200,group:'c'}),
		new Tile({name:'k',purchasable:true,cost:200,group:'d'}),
		new Tile({name:'l',purchasable:true,cost:200,group:'d'}),
		new Tile({name:'m',purchasable:true,cost:100,group:'d'}),
		new Tile({name:'n',purchasable:true,cost:200,group:'e'}),
		new Tile({name:'o',purchasable:true,cost:200,group:'e'}),
		new Tile({name:'p',purchasable:true,cost:200,group:'e'}),
		new Tile({name:'q',purchasable:true,cost:100,group:'f'}),
		new Tile({name:'r',purchasable:true,cost:200,group:'f'}),
		new Tile({name:'s',purchasable:true,cost:200,group:'f'}),
		new Tile({name:'t',purchasable:true,cost:200,group:'f'})
	);
	state.players.push(
		new Player({name:'steve'}),
		new Player({name:'jon'}), 
		new Player({name:'mikey'})
	);
	for (var i=0;i<state.players.length;i++) {
		state.positions.push(new PlayerState(state.players[i], 0));	
	}
}

module.exports = CartelGame;