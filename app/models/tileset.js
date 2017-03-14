var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TileSet = new Schema({
	name: String,
    tiles: [{
        name: String,
        visitingValue: Number,
        purchasable: Boolean,
        cost: Number,
        housePrice: Number,
        hotelPrice: Number,
        group: String,
        // [noHouses, oneHouse, twoHouses, threeHouses, hotel]
        rents: [Number],
        // rents: [{
        //     empty: Number,
        //     oneHouse: Number.
        //     twoHouse: Number,
        //     threeHouse: Number,
        //     hotel: Number
        // }]
        imageName: String
    }]
});

module.exports = mongoose.model('TileSet', TileSet);