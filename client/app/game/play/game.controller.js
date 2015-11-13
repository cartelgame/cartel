(function() {
	angular.module('cartel')
		.controller('GameController', ['$scope', 'GameService', '$location', '$routeParams', '$window', 'AuthService', 'SocketService',
			'SocketAuthService', GameController]);

	function GameController($scope, GameService, $location, $routeParams, $window, AuthService, SocketService, SocketAuthService) {
		$scope.gameId = $routeParams.gameId;
		$scope.user = AuthService.getPlayerName();

		console.log('Authenticating socket in Play Controller');

		SocketAuthService.getAuthenticatedAsPromise()
			.then(function success() {
				console.log('Done authentications socket in Game Controller');
				console.log('Getting game data');
				return GameService.GetById($scope.gameId);
			})
			.then(function success(game) {
				$scope.game = game;
				// Find the state belonging to this player
				$scope.playerState = _.find(game.playerStates, {name: $scope.user});
				$scope.isOwner = (game.owner == $scope.user);

				SocketService.socket.emit('player-available', $scope.gameId);

				SocketService.socket.on('game-deleted', function(data) {
					$window.alert('This game has been deleted - redirecting to the games list');
					$location.path('/games');
				});

				SocketService.socket.on('player-joined', function(playerName) {
					_.find($scope.game.playerStates, { name: playerName }).available = true;
				});

				SocketService.socket.on('player-disconnected', function(playerName) {
					_.find($scope.game.playerStates, { name: playerName }).available = false;
				});

				SocketService.socket.on('state-updated', function(gameState) {
					$scope.game = gameState;
				});
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

		// Listen for when the user leaves the view
		$scope.$on("$destroy", function(){
	        console.log("Left game page");
	        SocketService.disconnect();
	    });
	}
})();