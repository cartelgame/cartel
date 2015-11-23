(function() {
	angular.module('cartel')
		.controller('GameController', ['$scope', 'GameService', '$location', '$routeParams', '$window', 'AuthService', 'SocketService',
			'SocketAuthService', GameController]);

	function GameController($scope, GameService, $location, $routeParams, $window, AuthService, SocketService, SocketAuthService) {
		$scope.gameId = $routeParams.gameId;
		$scope.user = AuthService.getPlayerName();

		console.log('Authenticating socket in Play Controller');

		// Socket functions
		function socketGameDeleted(data) {
			$window.alert('This game has been deleted - redirecting to the games list');
			$location.path('/games');
		}

		function socketPlayerJoined(playerName) {
			_.find($scope.game.playerStates, { name: playerName }).available = true;
		}

		function socketPlayerDisconnected(playerName) {
			_.find($scope.game.playerStates, { name: playerName }).available = false;
		}

		function socketStateUpdated(gameState) {
			$scope.game = gameState;
		}

		SocketAuthService.getAuthenticatedAsPromise()
			.then(function success() {
				console.log('Done authentications socket in Game Controller');
				console.log('Getting game data');
				return GameService.GetById($scope.gameId);
			})
			.then(function success(game) {
				$scope.game = game;
				// Find the state belonging to this player
				// $scope.playerState = _.find(game.playerStates, {name: $scope.user});
				$scope.isOwner = (game.owner == $scope.user);

				// Listen for socket messages
				SocketService.socket.emit('player-available', $scope.gameId);
				SocketService.socket.on('game-deleted', socketGameDeleted);
				SocketService.socket.on('player-joined', socketPlayerJoined);
				SocketService.socket.on('player-disconnected', socketPlayerDisconnected);
				SocketService.socket.on('state-updated', socketStateUpdated);
			});

		$scope.deleteGame = function() {
			GameService.Delete($scope.game._id)
				.then(function(response) {
					SocketService.socket.emit('game-deleted');
					$location.path('games');
				});
		};

		$scope.deleteGame = function() {
			GameService.Delete($scope.game._id)
				.then(function(response) {
					SocketService.socket.emit('game-deleted');
					$location.path('games');
				});
		};

		$scope.isMyTurn = function() {
			if (!$scope.game) {
				return false;
			} else {
				return $scope.game.playerStates[$scope.game.playerIndex].name === $scope.user;
			}
		}

		$scope.canRoll = function() {
			return $scope.isMyTurn() && $scope.game.turnState === 0;
		}

		$scope.roll = function() {
			SocketService.socket.emit('roll');
		}

		$scope.endTurn = function() {
			SocketService.socket.emit('end-turn');
		}

		$scope.canPurchaseProperty = function() {
			if (!$scope.isMyTurn() || $scope.game.turnState != 1) {
				// It's not my turn or turn state isn't right
				return false;
			}

			var myState = _.find($scope.game.playerStates, {name: $scope.user});

			var tile = $scope.game.tileset.tiles[myState.position];

			if (!tile.purchasable) {
				return false;
			}
			// Find out if tile is owned by another player
			var found = false;
			_.each($scope.game.playerStates, function(playerState) {
				var result = _.find(playerState.ownedTiles, {index: myState.position});
				if (result) {
					found = true;
				}
			});

			return !found;
		}

		$scope.purchaseProperty = function() {
			if ($scope.canPurchaseProperty()) {
				SocketService.socket.emit('purchase-property');
			}
		}

		// Listen for when the user leaves the view
		$scope.$on("$destroy", function(){
	        console.log("Left game page");
	        SocketService.disconnect();
	    });
	}
})();