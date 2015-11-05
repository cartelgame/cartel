(function() {
	angular.module('cartel')
		.controller('LobbyController', ['$scope', 'GameService', '$location', '$routeParams', '$window', 'AuthService', 'SocketService',
			'SocketAuthService', LobbyController]);

	function LobbyController($scope, GameService, $location, $routeParams, $window, AuthService, SocketService, SocketAuthService) {
		$scope.gameId = $routeParams.gameId;
		$scope.user = AuthService.getPlayerName();

		console.log('Authenticating socket in Game Controller');

		SocketAuthService.getAuthenticatedAsPromise()
			.then(function success() {
				console.log('Done authentications socket in Game Controller');
				console.log('Getting game data');
				return GameService.GetById($scope.gameId);
			})
			.then(function success(game) {
				// If the game has already started, redirect to the play game page
				if (game.started) {
					$location.path('games/' + $scope.gameId + '/play');
					return;
				}

				$scope.game = game;
				// Find the state belonging to this player
				$scope.playerState = _.find(game.playerStates, {name: $scope.user});
				$scope.isOwner = (game.owner == $scope.user);

				SocketService.socket.emit('lobby-enter', $scope.gameId);

				SocketService.socket.on('player-ready', function(data) {
					_.find($scope.game.playerStates, { name: data.name }).ready = data.ready;
				});

				SocketService.socket.on('game-started', function(data) {
					$location.path('games/' + $scope.gameId + '/play');
				});

				SocketService.socket.on('game-deleted', function(data) {
					$window.alert('This game has been deleted - redirecting to the games list');
					$location.path('/games');
				});

				SocketService.socket.on('player-kicked', function(playerName) {
					if ($scope.user == playerName) {
						$window.alert('You have been kicked from the game - redirecting to the games list');
						$location.path('/games');
					} else {
						_.remove($scope.game.playerStates, {name: playerName});
					}
				});

				SocketService.socket.on('player-disconnected', function(playerName) {
					_.remove($scope.game.playerStates, {name: playerName});
					$scope.playerState.ready = false;
				});

				SocketService.socket.on('player-joined', function(playerName) {
					// add the player to the game if it doesn't already exist
					if (!_.find($scope.game.playerStates, {name: playerName})) {
						$scope.game.playerStates.push({
							name: playerName,
							ready: false
						});
					}
				});
			});

		$scope.deleteGame = function() {
			GameService.Delete($scope.game._id)
				.then(function(response) {
					SocketService.socket.emit('game-deleted');
					$location.path('games');
				});
		};

		$scope.everyoneReady = function() {
			if (!$scope.game || $scope.game.playerStates.length < 2) {
				return false;
			}
			return !(_.find($scope.game.playerStates, {ready: false}));
		};

		$scope.updateReadyStatus = function() {
			SocketService.socket.emit('player-ready', {
				ready: $scope.playerState.ready,
				game: $scope.gameId
			});
		};

		$scope.kickUser = function(playerName) {
			SocketService.socket.emit('kick-player', playerName);
			_.remove($scope.game.playerStates, {name: playerName});
		}

		$scope.startGame = function() {
			if (!_.find($scope.game.playerStates, {ready: false})) {
				SocketService.socket.emit('start-game');
				// $scope.game.started = true;
				$location.path('games/' + $scope.gameId + '/play');
			}
		}

		// Listen for when the user leaves the view
		$scope.$on("$destroy", function(){
	        console.log("Left game page");
	        SocketService.disconnect();
	    });
	}
})();