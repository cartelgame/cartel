var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var PlayerState = require('./player-state');
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
    playerStates: [{
        name: String,
        position: {type: Number, default: 0},
        // References to owned tiles
        ownedTiles: [Number],
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
    // tileset: String,	// Manual reference since automatic references don't seem to be working properly
});

GameState.statics.TURN_START = 0;
GameState.statics.TURN_END = 1;

GameState.methods.getPlayerStateByName = function findSimilarType (name) {
    return this.playerStates.filter(function(playerState) {
        return playerState.name === name;
    }).pop();
};

module.exports = mongoose.model('GameState', GameState);