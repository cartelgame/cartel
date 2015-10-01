var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Game = new Schema({
    name: { type: String, index: true },
    owner: String
});

Game.statics.findByName = function(name, cb) {
	return this.find({ name: new RegExp(name, 'i') }, cb);
}


module.exports = mongoose.model('Game', Game);