var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
    name: String,
    owner: {type: String, index: true},
    players: [{
    	name: String,
    	ready: Boolean
    }],
    bannedPlayers: [String],
    chatHistory: [{
    	playerName: String,
    	message: String
    }]
});

module.exports = mongoose.model('Game', Game);