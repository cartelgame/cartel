var CartelGame = require('./cartel-game');

var game = new CartelGame();

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