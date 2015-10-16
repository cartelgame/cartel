(function() {
	angular.module('cartel')
		.controller('GameController', ['$scope', 'GameService', '$location', '$routeParams', '$localStorage', 'SocketService',
			'SocketAuthService', GameController]);

	function GameController($scope, GameService, $location, $routeParams, $localStorage, SocketService, SocketAuthService) {
		$scope.gameId = $routeParams.gameId;
		$scope.user = $localStorage.user;

		console.log('Authenticating socket in Game Controller');
		SocketAuthService.getAuthenticatedAsPromise()
			.then(function() {
				console.log('Done authentications socket in Game Controller');
				console.log('Getting game data');
				return GameService.GetById($scope.gameId);
			})
			.then(function(game) {
				$scope.game = game;
				// Find the state belonging to this player
				$scope.playerState = _.find(game.players, {name: $localStorage.user});
				$scope.isOwner = (game.owner == $localStorage.user);

				SocketService.socket.emit('join', $scope.gameId);

				SocketService.socket.on('player-ready', function(data){
					_.find($scope.game.players, {name: data.name}).ready = data.ready;
					// Find the state belonging to this player
					// $scope.playerState = _.find($scope.game.players, {name: $localStorage.user});
				});

			});

		$scope.deleteGame = function() {
			GameService.Delete($scope.game._id)
				.then(function(response) {
					$location.path('games');
				});
		};

		$scope.everyoneReady = function() {
			if (!$scope.game) {
				return false;
			}
			return !(_.find($scope.game.players, {ready: false}));
		};

		$scope.updateReadyStatus = function() {
			SocketService.socket.emit('player-ready', {
				ready: $scope.playerState.ready,
				game: $scope.gameId
			});
		};

		
	}
})();