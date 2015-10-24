var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tile = new Schema({
    name: String,
    visitingValue: Number,
    purchasable: Boolean,
    cost: Number,
    housePrice: Number,
    hotelPrice: Number,
    group: String
});

var TileSet = new Schema({
	name: String,
    tiles: [Tile]
});

module.exports = mongoose.model('TileSet', TileSet);