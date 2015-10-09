(function() {
	angular.module('cartel')
		.controller('GameListController', ['$scope', '$http', '$location', '$routeParams', 'GameService', GameListController]);

	function GameListController($scope, $http, $location, $routeParams, GameService) {
		GameService.GetAll()
			.then(function (response) {
				$scope.games = response;
			});

		$scope.createGame = function() {
			if ($scope.gameName) {
				GameService.Create($scope.gameName)
					.then(function (game) {
						console.log(game);
						console.log("Successfully created game");
						$scope.game = game;
						$location.path('games/' + game._id);
					});
			}
		}
	}
})();