function PlayerState(player, position) {
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
}

module.exports = PlayerState;