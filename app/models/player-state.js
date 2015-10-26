var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerState = new Schema({
    name: String,
    position: {type: Number, default: 0},
    // References to owned tiles
    ownedTiles: [Number],
    cash: {type: Number, default: 1500}
});

PlayerState.methods.add = function(tileIndex) {
    if (this.ownedTiles.indexOf(tileIndex) < 0) {
        this.ownedTiles.push(tileIndex);
    }
};

PlayerState.methods.remove = function(tileIndex) {
    var index = -1;
    for (var i = 0; i < this.ownedTiles.length; i++) {
        if (tileIndex === this.ownedTiles[i]) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        delete this.ownedTiles[index];
    }
}

module.exports = mongoose.model('PlayerState', PlayerState);