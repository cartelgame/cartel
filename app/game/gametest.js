var CartelGame = require('./cartel-game');
var Tile = require('./tile');

var game = new CartelGame();

game.tiles = [
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
];

game.init();

for (var i=0;i<10;i++) {
	for (var j=0;j<game.state.players.length;j++) {
		var res = game.next();
		var player = game.state.players[j];
		var tile = game.getCurrentTileForPlayer(player);
		if (tile) {
			if (game.canPurchaseTile(tile, player)) {
				game.purchaseTile(tile, game.state.players[j]);
			}
		}

		// show state
		console.log(
			'\r\nresult:' + res[0],
			'\r\nplayer: ' + game.state.positions[j].player.name, 
			'\r\ncash: ' + game.state.positions[j].player.cash,
			'\r\nposition: ' + game.state.positions[j].position
			);
	}
};

console.log(game.serialize());