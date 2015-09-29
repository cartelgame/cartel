var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
    name: String,
    players: Array
});


module.exports = mongoose.model('Game', Game);