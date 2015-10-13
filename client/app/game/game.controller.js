(function() {
	angular.module('cartel')
		.controller('GameController', ['$scope', 'GameService', '$location', '$routeParams', '$localStorage', 'SocketService',
			'SocketAuthService', GameController]);

	function GameController($scope, GameService, $location, $routeParams, $localStorage, SocketService, SocketAuthService) {
		$scope.gameId = $routeParams.gameId;

		GameService.GetById($scope.gameId)
			.then(function(game) {
				$scope.game = game;
				$scope.isOwner = (game.owner == $localStorage.user);
				
				SocketAuthService.getAuthenticatedAsPromise()
					.then(function(socket) {
						console.log('Done authentications socket in Game Controller');
						SocketService.socket.emit('joined', $localStorage.user);
					})
			});

		$scope.deleteGame = function() {
			GameService.Delete($scope.game._id)
				.then(function(response) {
					$location.path('games');
				});
		}
	}
})();