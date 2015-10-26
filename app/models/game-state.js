var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PlayerState = require('./player-state');
var TileSet = require('./tileset');

var GameState = new Schema({
    // TODO: should player states be nested or references? Are the used outside of a game state?
    playerStates: [PlayerState.schema],
    // TODO: should pick random player to start
    playerIndex: {type: Number, default: 0},
    // Tileset stored by reference
    tileset: { type: Schema.Types.ObjectId, ref: 'TileSet' }
});

module.exports = mongoose.model('GameState', GameState);