(function() {
	var app = angular.module('cartel', ['cartel.services', 'ngRoute']);

	app.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/games', {
					templateUrl: 'partials/views/games.html',
					controller: 'GamesController'
				}).
				when('/games/:gameId', {
					templateUrl: 'partials/views/game.html',
					controller: 'GameController'
				}).
				otherwise({
		        	redirectTo: '/games'
		      	});
		}]);


	app.controller('GamesController', ['$scope', '$http', '$location', '$routeParams',
		function($scope, $http, $location, $routeParams) {
			$http.get('/games')
				.then(function(response) {
					$scope.games = response.data;
				}, function(response) {
					// TODO handle error
					console.log("Error getting games list");
				});

			$scope.createGame = function() {
				if ($scope.gameName) {
					$http.post('/game', { name: $scope.gameName })
						.then(function(response) {
							$scope.game = response.data;
							console.log("Created game:");
							console.log(response.data);
							$location.path('games/' + response.data._id);
						}, function(response) {
							// TODO handle error
							console.log("Error getting servers list - " + response.data);
						});
				}
			}
		}]);

	app.controller('GameController', ['$scope', '$http', '$location', '$routeParams',
		function($scope, $http, $location, $routeParams) {
			$scope.gameId = $routeParams.gameId;
		}]);


	app.directive('chat', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/components/chat.html',
			scope: {},
			controller: ['cartelSocket', '$scope', function(cartelSocket, $scope) {

				console.log("Loading chat");
				console.log(cartelSocket);

				$scope.messages = [];

				cartelSocket.on('chat message', function(msg){
					$scope.messages.push(msg);
				});

				$scope.sendChatMessage = function() {
					if ($scope.currentMessage) {
						cartelSocket.emit('chat message', $scope.currentMessage);
						$scope.currentMessage = "";
					}
				}
			}]
		};
	});
})();