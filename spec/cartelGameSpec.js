var TileSet = require('../app/models/tileset');
var GameState = require('../app/models/game-state');
var cartelGame = require('../app/game/cartel-game');
var testSetup = require('./support/modules/setup.js');

describe("cartel-game", function() {
	describe("roll", function() {
		var state = testSetup.createGameState();
		it("moves the play forward the expected number of spaces", function() {
			// Player starts at 0
			expect(state.playerStates[0].position).toBe(0);
			// Turn state is start
			expect(state.turnState).toBe(GameState.TURN_START);

			// Roll using loaded dice
			cartelGame.roll(state, testSetup.createTestDice(3, 5));

			// Player moves to another position
			expect(state.playerStates[0].position).toBe(8);
			// Turn state is end
			expect(state.turnState).toBe(GameState.TURN_END);

		});

		it("allows users to buy purchaseable tiles", function() {
			// Player starts at tile 8 (from previous test)
			expect(state.playerStates[0].position).toBe(8);
			// Turn state is end
			expect(state.turnState).toBe(GameState.TURN_END);
			// User has 1500 in cash
			expect(state.playerStates[0].cash).toBe(1500);

			// Check if we can purchase the tile
			var canPurchase = cartelGame.canPurchaseTile(state);
			expect(canPurchase).toBe(true);

			// Purchase the tile
			cartelGame.purchaseTile(state);

			// Check that the tile was purchased
			expect(state.playerStates[0].ownedTiles[0].index).toBe(8);
			expect(state.playerStates[0].ownedTiles[0].houses).toBe(0);
			expect(state.playerStates[0].ownedTiles[0].hotel).toBe(false);
			// Check the player paid the right amount
			expect(state.playerStates[0].cash).toBe(1300);

			cartelGame.endTurn(state);
		});

		it("charges rent for owned tiles", function() {
			// Roll using loaded dice to land on the same property
			cartelGame.roll(state, testSetup.createTestDice(3, 5));
			cartelGame.endTurn(state);

			expect(state.getPlayerStateByName('jon').cash).toBe(1450);

			// Check if we can purchase the tile
			var canPurchase = cartelGame.canPurchaseTile(state);
			// The player can't purchase it because it's already owned
			expect(canPurchase).toBe(false);
		});
	});

	describe("endTurn", function() {
		it("doesn't end turn prematurely", function() {
			var state = testSetup.createGameState();
			expect(state.playerIndex).toBe(0);
			expect(state.turnState).toBe(GameState.TURN_START);
			cartelGame.endTurn(state);
			// State should not change since we can't end our turn unless we roll
			expect(state.playerIndex).toBe(0);
			expect(state.turnState).toBe(GameState.TURN_START);
		});

		it("changes turn state and player", function() {
			var state = testSetup.createGameState();

			expect(state.playerIndex).toBe(0);
			expect(state.turnState).toBe(GameState.TURN_START);

			cartelGame.roll(state, testSetup.createTestDice(3, 5));

			expect(state.turnState).toBe(GameState.TURN_END);
			cartelGame.endTurn(state);

			// State should change since we can end our turn after we roll
			expect(state.playerIndex).toBe(1);
			expect(state.turnState).toBe(GameState.TURN_START);
		});
	});

});