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
						console.log("Successfully created game");
						$scope.game = game;
						$location.path('games/' + game.data._id);
					});

				// $http.post('/game', { name: $scope.gameName })
				// 	.then(function(response) {
				// 		$scope.game = response.data;
				// 		console.log("Created game:");
				// 		console.log(response.data);
				// 		$location.path('games/' + response.data._id);
				// 	}, function(response) {
				// 		// TODO handle error
				// 		console.log("Error getting servers list - " + response.data);
				// 	});
			}
		}
	}
})();