var cartel = {};

cartel.dice = {
	getRandomInt: function(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	roll: function() {
		return [this.getRandomInt(1,6), this.getRandomInt(1,6)];
	}

};

cartel.tile = function(params) {
	this.name = params.name;
	this.visitingValue = params.visitingValue;
	this.purchasable = params.purchasable;
	this.cost = params.cost;
	this.housePrice = params.housePrice;
	this.hotelPrice = params.hotelPrice;
	this.group = params.group;
}

cartel.player = function(params) {
	this.name = params.name;
	this.cash = 1500;
};

cartel.playerState = function(player, position) {
	this.player = player;
	this.position = position;
	this.ownedTiles = [];

	this.add = function(tile) {
		this.ownedTiles.push(tile);
	};

	this.remove = function(tile) {
		var index = -1;
		for (var i=0;i<this.ownedTiles.length;i++) {
			if (tile===this.ownedTiles[i]) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			delete this.ownedTiles[index];
		}
	};
};

cartel.game = {

	state: {
		tiles: [],
		players: [],
		positions: [],
		playerIndex: 0
	},

	iteratePlayers: function(visitor) {
		var state = this.state;

		for(var i=0;i<state.players.length;i++) {
			visitor(state.players[i]);
		}		
	},

	getCurrentTileForPlayer: function(player) {
		var state = this.state;

		return state.tiles[this.getStateForPlayer(player).position];
	},

	getStateForPlayer: function(player) {
		var state = this.state;

		for (var i=0;i<state.positions.length;i++) {
			if (state.positions[i].player===player) {
				return state.positions[i];
			}
		}
	},

	canPurchaseTile: function(tile,player) {
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
	},

	purchaseTile: function(tile,player) {
		var state = this.state;
		var playerState = this.getStateForPlayer(player);
		playerState.add(tile);
		playerState.player.cash -= tile.cost;
	},

	next: function() {

		var result = [];

		var state = this.state;

		var dice = cartel.dice.roll();

		var diceValue = dice[0] + dice[1];

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
		result.push({'dice': dice});

		return result;
	},

	test: function() {

		this.iteratePlayers(
			function(player) {
				console.log(player.name);
			}
		);
	},

	serialize: function() {
		return JSON.stringify(cartel.game.state);
	},

	init: function() {

		var state = this.state;

		state.tiles.push(
			new cartel.tile({name:'a',visitingValue:200,purchasable:false}),
			new cartel.tile({name:'b',purchasable:true,cost:100,group:'a'}),
			new cartel.tile({name:'c',purchasable:true,cost:200,group:'a'}),
			new cartel.tile({name:'d',purchasable:true,cost:200,group:'a'}),
			new cartel.tile({name:'e',purchasable:true,cost:200,group:'b'}),
			new cartel.tile({name:'f',purchasable:true,cost:200,group:'b'}),
			new cartel.tile({name:'g',purchasable:true,cost:100,group:'b'}),
			new cartel.tile({name:'h',purchasable:true,cost:200,group:'c'}),
			new cartel.tile({name:'i',purchasable:true,cost:200,group:'c'}),
			new cartel.tile({name:'j',purchasable:true,cost:200,group:'c'}),
			new cartel.tile({name:'k',purchasable:true,cost:200,group:'d'}),
			new cartel.tile({name:'l',purchasable:true,cost:200,group:'d'}),
			new cartel.tile({name:'m',purchasable:true,cost:100,group:'d'}),
			new cartel.tile({name:'n',purchasable:true,cost:200,group:'e'}),
			new cartel.tile({name:'o',purchasable:true,cost:200,group:'e'}),
			new cartel.tile({name:'p',purchasable:true,cost:200,group:'e'}),
			new cartel.tile({name:'q',purchasable:true,cost:100,group:'f'}),
			new cartel.tile({name:'r',purchasable:true,cost:200,group:'f'}),
			new cartel.tile({name:'s',purchasable:true,cost:200,group:'f'}),
			new cartel.tile({name:'t',purchasable:true,cost:200,group:'f'})
		);
		state.players.push(
			new cartel.player({name:'steve'}),
			new cartel.player({name:'jon'}), 
			new cartel.player({name:'mikey'})
		);
		for (var i=0;i<state.players.length;i++) {
			state.positions.push(new cartel.playerState(state.players[i], 0));	
		}
	}

};

// initialise the game
cartel.game.init();

// play ten moves for each player
for (var i=0;i<10;i++) {
	for (var j=0;j<cartel.game.state.players.length;j++) {
		var res = cartel.game.next();
		var player = cartel.game.state.players[j];
		var tile = cartel.game.getCurrentTileForPlayer(player);
		if (tile) {
			if (cartel.game.canPurchaseTile(tile, player)) {
				cartel.game.purchaseTile(tile, cartel.game.state.players[j]);
			}
		}

		// show state
		console.log(
			'\r\nresult:' + res[0],
			'\r\nplayer: ' + cartel.game.state.positions[j].player.name, 
			'\r\ncash: ' + cartel.game.state.positions[j].player.cash,
			'\r\nposition: ' + cartel.game.state.positions[j].position
			);
	}
};

// serialize
//console.log(cartel.game.serialize());

cartel.game.test();

