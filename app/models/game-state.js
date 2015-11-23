var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var TileSet = require('./tileset');

var GameState = new Schema({
	name: String,
	owner: {type: String, index: true},
	bannedPlayers: [String],
    started: Boolean,
    chatHistory: [{
    	playerName: String,
    	message: String
    }],
    playerStates: [{
        name: String,
        position: {type: Number, default: 0},
        // References to owned tiles
        ownedTiles: [{
            index: Number,
            houses: {type: Number, default: 0},
            hotel: {type: Boolean, default: false}
        }],
        cash: {type: Number, default: 1500},
        // Whether the player is ready to start the game from the lobby
        ready: Boolean,
        // Whether the player is connected to the game once it's started
        available: Boolean
    }],
    // playerStates: [PlayerState.schema],
    // TODO: should pick random player to start
    playerIndex: {type: Number, default: 0},
    // Which stage of the turn we are on - 0: turn start (pre-roll), 1: turn end (post-roll)
    turnState: {type: Number, default: 0},
    // Tileset stored by reference
    tileset: { type: Schema.Types.ObjectId, ref: 'TileSet' }
});

GameState.statics.TURN_START = 0;
GameState.statics.TURN_END = 1;

GameState.methods.getPlayerStateByName = function(name) {
    var result = this.playerStates.filter(function(playerState) {
        return playerState.name === name;
    }).pop();
    if (result) {
        return result;
    }
    return null;
};

GameState.methods.getCurrentPlayerState = function() {
    return this.playerStates[this.playerIndex];
}

GameState.methods.getTileOwner = function(tileIndex) {
    for (var i = 0; i < this.playerStates.length; i++) {
        var otherPlayerState = this.playerStates[i];
        for (var j = 0; j < otherPlayerState.ownedTiles.length; j++) {
            if (otherPlayerState.ownedTiles[j].index === tileIndex) {
                return otherPlayerState;
            }
        }
    }
    return null;
}

module.exports = mongoose.model('GameState', GameState);