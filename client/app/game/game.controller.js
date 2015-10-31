(function() {
	angular.module('cartel')
		.controller('GameController', ['$scope', 'GameService', '$location', '$routeParams', '$window', 'AuthService', 'SocketService',
			'SocketAuthService', GameController]);

	function GameController($scope, GameService, $location, $routeParams, $window, AuthService, SocketService, SocketAuthService) {
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
				$scope.game = game;
				// Find the state belonging to this player
				$scope.playerState = _.find(game.playerStates, {name: $scope.user});
				$scope.isOwner = (game.owner == $scope.user);

				SocketService.socket.emit('join', $scope.gameId);

				SocketService.socket.on('player-ready', function(data) {
					_.find($scope.game.playerStates, { name: data.name }).ready = data.ready;
				});

				SocketService.socket.on('game-started', function(data) {
					$scope.game.started = true;
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

		// Listen for when the user leaves the view
		$scope.$on("$destroy", function(){
	        console.log("Left game page");
	        SocketService.disconnect();
	    });
	}
})();