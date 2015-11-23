var GameState = require('../../../app/models/game-state');
var TileSet = require('../../../app/models/tileset');

module.exports = {
	createTestTileset: function () {
		return new TileSet({
			name: "default",
			tiles: [
				{name: 'Go!', 				visitingValue: 200, purchasable: false},
				{name: 'Minish Woods', 		purchasable: true, cost: 60, 	group: 'a'},
				{name: 'Ordon Village', 	purchasable: true, cost: 60, 	group: 'a'},
				{name: 'Kokiki Forest', 	purchasable: true, cost: 60, 	group: 'b'},
				{name: 'Lost Woods', 		purchasable: true, cost: 100, 	group: 'b'},
				{name: 'Forest Temple', 	purchasable: true, cost: 100, 	group: 'b'},
				{name: 'Graveyard', 		purchasable: true, cost: 200, 	group: 'c'},
				{name: 'Kakariko Village', 	purchasable: true, cost: 100, 	group: 'c'},
				{name: 'Shadow Temple', 	purchasable: true, cost: 200, 	group: 'c', rents: [50, 100, 150, 200, 250]},
				{name: 'Haunted Wasteland', purchasable: true, cost: 200, 	group: 'd'},
				{name: 'Gerudo Fortress', 	purchasable: true, cost: 200, 	group: 'd'},
				{name: 'Spirit Template', 	purchasable: true, cost: 200, 	group: 'd'},
				{name: 'Death Mountain', 	purchasable: true, cost: 200, 	group: 'e'},
				{name: 'Goron City', 		purchasable: true, cost: 100, 	group: 'e'},
				{name: 'Fire Temple', 		purchasable: true, cost: 200, 	group: 'e'},
				{name: 'Lon Lon Ranch', 	purchasable: true, cost: 200, 	group: 'f'},
				{name: 'Hyrule Castle', 	purchasable: true, cost: 200, 	group: 'f'},
				{name: 'Temple of Time', 	purchasable: true, cost: 100, 	group: 'f'},
				{name: 'Lake Hylia', 		purchasable: true, cost: 200, 	group: 'g'},
				{name: 'Zora\'s Domain', 	purchasable: true, cost: 200, 	group: 'g'},
				{name: 'Water Temple', 		purchasable: true, cost: 200, 	group: 'g'},
				{name: 'Skyloft', 			purchasable: true, cost: 200, 	group: 'h'},
				{name: 'City in the Sky', 	purchasable: true, cost: 200, 	group: 'h'},
				{name: 'w', purchasable: true, cost: 200, group: 'f'},
				{name: 'x', purchasable: true, cost: 200, group: 'f'},
				{name: 'y', purchasable: true, cost: 200, group: 'f'},
				{name: 'z', purchasable: true, cost: 200, group: 'f'},
				{name: 'aa', purchasable: true, cost: 200, group: 'f'},
				{name: 'ab', purchasable: true, cost: 200, group: 'f'},
				{name: 'ac', purchasable: true, cost: 200, group: 'f'},
				{name: 'ad', purchasable: true, cost: 200, group: 'f'},
				{name: 'ae', purchasable: true, cost: 200, group: 'f'},
				{name: 'af', purchasable: true, cost: 200, group: 'f'},
				{name: 'ag', purchasable: true, cost: 200, group: 'f'},
				{name: 'ah', purchasable: true, cost: 200, group: 'f'},
				{name: 'ai', purchasable: true, cost: 200, group: 'f'},
				{name: 'aj', purchasable: true, cost: 200, group: 'f'},
				{name: 'ak', purchasable: true, cost: 200, group: 'f'},
				{name: 'al', purchasable: true, cost: 200, group: 'f'},
				{name: 'am', purchasable: true, cost: 200, group: 'f'},
				{name: 'an', purchasable: true, cost: 200, group: 'f'}
			]
		});
	},

	createTestDice: function(value1, value2) {
		return testDice = {
			roll: function() {
				return [value1, value2];
			}
		}
	},

	createGameState: function() {
		return new GameState({
			playerStates: [{
				name: 'steve',
				cash: 1500,
				ownedTiles: [{
					index: 7
				}]
			}, {
				name: 'jon',
				cash: 1500,
				ownedTiles: [{
					index: 15
				}]
			}, {
				name: 'mikey',
				cash: 1500,
				ownedTiles: [{
					index: 20
				}]
			}],
			tileset: this.createTestTileset()
		});
	}
}