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
    // TODO: check if tileIndex already owned
    this.ownedTiles.push(tileIndex);
};

PlayerState.methods.remove = function(tile) {
    var index = -1;
    for (var i=0;i<this.ownedTiles.length;i++) {
        if (tile===this.ownedTiles[i]) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        delete this.ownedTiles[index];
    }
}

module.exports = mongoose.model('PlayerState', PlayerState);