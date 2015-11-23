var TileSet = require('../app/models/tileset');
var GameState = require('../app/models/game-state');
var cartelGame = require('../app/game/cartel-game');
var testSetup = require('./support/modules/setup.js');

describe("cartel-game", function() {
	describe("roll", function() {
		it("moves the play forward the expected number of spaces", function() {
			var state = testSetup.createGameState();

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

		it("charges rent for owned tiles", function() {
			var state = testSetup.createGameState();

			// Roll using loaded dice
			cartelGame.roll(state, testSetup.createTestDice(3, 5));
			// Purchase the tile
			cartelGame.purchaseTile(state);
			cartelGame.endTurn(state);

			// Roll using loaded dice to land on the same property
			cartelGame.roll(state, testSetup.createTestDice(3, 5));
			cartelGame.endTurn(state);

			expect(state.getPlayerStateByName('jon').cash).toBe(1450);
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