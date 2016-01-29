(function() {
	angular.module('cartel')
		.controller('GameListController', ['$scope', '$location', 'GameService', 'AuthService', GameListController]);

	function GameListController($scope, $location, GameService, AuthService) {

		$scope.playerName = AuthService.getPlayerName();

		$scope.createGame = function() {
			if ($scope.gameName) {
				GameService.Create($scope.gameName)
					.then(function(game) {
						console.log(game);
						console.log("Successfully created game");
						$scope.game = game;
						$location.path('games/' + game._id);
					});
			}
		};

		GameService.GetAll()
			.then(function success(games) {
				console.log(games);
				$scope.games = games;
			}, function failure(err) {
				console.log("Error");
				console.log(err);
			});
	}
})();