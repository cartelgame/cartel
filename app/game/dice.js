// Private methods
var getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	roll: function() {
		return [getRandomInt(1,6), getRandomInt(1,6)];
	}
}