var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PlayerState = require('./player-state');
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
    // TODO: should player states be nested or references? Are the used outside of a game state?
    playerStates: [PlayerState.schema],
    // TODO: should pick random player to start
    playerIndex: {type: Number, default: 0},
    // Tileset stored by reference
    tileset: { type: Schema.Types.ObjectId, ref: 'TileSet' }
});

GameState.methods.getPlayerStateByName = function findSimilarType (name) {
    return this.playerStates.filter(function(playerState) {
        return playerState.name === name;
    }).pop();
};

module.exports = mongoose.model('GameState', GameState);