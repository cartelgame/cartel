function Tile(params) {
	this.name = params.name;
	this.visitingValue = params.visitingValue;
	this.purchasable = params.purchasable;
	this.cost = params.cost;
	this.housePrice = params.housePrice;
	this.hotelPrice = params.hotelPrice;
	this.group = params.group;
}

module.exports = Tile;