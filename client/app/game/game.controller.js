(function() {
	angular.module('cartel')
		.controller('GameController', ['$scope', 'GameService', '$location', '$routeParams', '$localStorage', GameController]);

	function GameController($scope, GameService, $location, $routeParams, $localStorage) {
		$scope.gameId = $routeParams.gameId;

		GameService.GetById($scope.gameId)
			.then(function(game) {
				$scope.game = game;
				$scope.isOwner = (game.owner == $localStorage.user);
			});

		$scope.deleteGame = function() {
			GameService.Delete($scope.game._id)
				.then(function(response) {
					$location.path('games');
				});
		}
	}
})();