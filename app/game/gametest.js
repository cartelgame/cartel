var GameState = require('../models/game-state');
var TileSet = require('../models/tileset');
var mongoose = require('mongoose');
var CartelGame = require('./cartel-game');
var async = require('async');

mongoose.connect('mongodb://localhost/carteltest');

async.waterfall([
	function(callback) {
		TileSet.remove({}, function() {
			console.log("Cleared tilesets");
			callback();
		});
	},
	function(callback) {
		GameState.remove({}, function(){
			console.log('Cleared game states');
			callback();
		});
	},
	function(callback) {

		var tileset = new TileSet({
			name: "Test Set",
			tiles: [
				{name: 'a', visitingValue: 200, purchasable: false},
				{name: 'b', purchasable: true, cost: 100, group: 'a'},
				{name: 'c', purchasable: true, cost: 200, group: 'a'},
				{name: 'd', purchasable: true, cost: 200, group: 'a'},
				{name: 'e', purchasable: true, cost: 200, group: 'b'},
				{name: 'f', purchasable: true, cost: 200, group: 'b'},
				{name: 'g', purchasable: true, cost: 100, group: 'b'},
				{name: 'h', purchasable: true, cost: 200, group: 'c'},
				{name: 'i', purchasable: true, cost: 200, group: 'c'},
				{name: 'j', purchasable: true, cost: 200, group: 'c'},
				{name: 'k', purchasable: true, cost: 200, group: 'd'},
				{name: 'l', purchasable: true, cost: 200, group: 'd'},
				{name: 'm', purchasable: true, cost: 100, group: 'd'},
				{name: 'n', purchasable: true, cost: 200, group: 'e'},
				{name: 'o', purchasable: true, cost: 200, group: 'e'},
				{name: 'p', purchasable: true, cost: 200, group: 'e'},
				{name: 'q', purchasable: true, cost: 100, group: 'f'},
				{name: 'r', purchasable: true, cost: 200, group: 'f'},
				{name: 's', purchasable: true, cost: 200, group: 'f'},
				{name: 't', purchasable: true, cost: 200, group: 'f'}
			]
		});

		tileset.save(function() {
			console.log("Saved tileset " + tileset);
			callback(null, tileset);
		});

	},

	function(tileset, callback) {

		var state = new GameState({
			playerStates: [{
				name: 'steve',
				cash: 1500
			}, {
				name: 'jon',
				cash: 1500
			}, {
				name: 'mikey',
				cash: 1500
			}],
			tileset: tileset
		});

		state.save(function() {
			console.log("Saved initial game state")
			callback(null, state);
		});
	},

	function(state, callback) {
		console.log("Running through some turns");

		for (var i = 0; i < 10; i++) {
			for (var j = 0; j < state.playerStates.length; j++) {
				var res = CartelGame.roll(state);
				var playerState = state.playerStates[j];
				if (CartelGame.canPurchaseTile(state, playerState.position, playerState)) {
					CartelGame.purchaseTile(state, playerState.position, playerState);
				}
				CartelGame.endTurn();
			}
		};

		console.log("Saving game state");
		state.save(function() {
			console.log("Saved game state");
			console.log(JSON.stringify(state, null, 4));
			callback(null, state);
		});		
	},

	function(state, callback) {
		console.log("finding state %s", state._id);

		var steveState = state.getPlayerStateByName('steve');
		console.log(steveState);
		playerState.add(12345);
		callback();
	},

	function(callback) {
		mongoose.disconnect();
		callback();
	}
])
