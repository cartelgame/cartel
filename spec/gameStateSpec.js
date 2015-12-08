var GameState = require('../app/models/game-state');
var testSetup = require('./support/modules/setup.js');

describe("game-state", function() {
	describe("getPlayerStateByName", function() {
		var gameState = testSetup.createGameState();

		it("gets an existing player state", function() {
			var playerState = gameState.getPlayerStateByName('steve');
			expect(playerState).toBe(gameState.playerStates[0]);

			playerState = gameState.getPlayerStateByName('jon');
			expect(playerState).toBe(gameState.playerStates[1]);

			playerState = gameState.getPlayerStateByName('mikey');
			expect(playerState).toBe(gameState.playerStates[2]);
		});

		it("returns null for non-existing player state", function() {
			var playerState = gameState.getPlayerStateByName('idontexist');
			expect(playerState).toBeNull();
		});

	});

	describe("getTileOwner", function() {
		var gameState = testSetup.createGameStateWithOwnedTiles();

		it("gets the owner for owned tiles", function() {
			var owner = gameState.getTileOwner(7);
			expect(owner).toBe(gameState.playerStates[0]);

			owner = gameState.getTileOwner(15);
			expect(owner).toBe(gameState.playerStates[1]);

			owner = gameState.getTileOwner(20);
			expect(owner.name).toBe(gameState.playerStates[2].name);
		});

		it("returns null for non-owned tiles", function() {
			var owner = gameState.getTileOwner(5);
			expect(owner).toBeNull();

			owner = gameState.getTileOwner(16);
			expect(owner).toBeNull();

			owner = gameState.getTileOwner(22);
			expect(owner).toBeNull();
		});
	});

});