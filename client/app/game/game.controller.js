(function() {
	angular.module('cartel')
		.controller('GameController', ['$scope', 'GameService', '$location', '$routeParams', '$localStorage', 'SocketService', GameController]);

	function GameController($scope, GameService, $location, $routeParams, $localStorage, SocketService) {
		$scope.gameId = $routeParams.gameId;



		GameService.GetById($scope.gameId)
			.then(function(game) {
				$scope.game = game;
				$scope.isOwner = (game.owner == $localStorage.user);

				// var socket = io();

				// socket.emit('joined', $localStorage.user);

				// TODO: connect to the socket
				SocketService.emit('joined', $localStorage.user);
			});

		$scope.deleteGame = function() {
			GameService.Delete($scope.game._id)
				.then(function(response) {
					$location.path('games');
				});
		}
	}
})();