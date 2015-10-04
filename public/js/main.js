(function() {
	'use strict';
	var app = angular.module('cartel', ['ngRoute']);

	app.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/login', {
					templateUrl: 'partials/views/loginView.html',
					controller: 'LoginController'
				}).
				when('/games', {
					templateUrl: 'partials/views/games.html',
					controller: 'GamesController'
				}).
				when('/games/:gameId', {
					templateUrl: 'partials/views/game.html',
					controller: 'GameController'
				}).
				otherwise({
		        	redirectTo: '/login'
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

			$http({
				url: '/game',
				method: 'GET',
				params: { gameId: $scope.gameId }
			})
			.then(function(response) {

			}, function(response) {
				// TODO handle error
				console.log("Error getting game");
			});
		}]);

	app.controller('LoginController', ['$location', 'AuthenticationService', 'FlashService',
		function($location, AuthenticationService, FlashService) {
			console.log("Login Controller");
			// TODO: shouldn't we just use scope for this?
			var vm = this;

	        vm.login = login;

	        (function initController() {
	            // reset login status
	            AuthenticationService.ClearCredentials();
	        })();

	        function login() {
	            vm.dataLoading = true;
	            AuthenticationService.Login(vm.username, vm.password, function (response) {
	                if (response.success) {
	                    AuthenticationService.SetCredentials(vm.username, vm.password);
	                    $location.path('/');
	                } else {
	                    FlashService.Error(response.message);
	                    vm.dataLoading = false;
	                }
	            });
	        };
		}])


	app.directive('chat', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/components/chat.html',
			scope: {},
			controller: ['SocketService', '$scope', function(SocketService, $scope) {

				console.log("Loading chat");
				console.log(SocketService);

				$scope.messages = [];

				SocketService.on('chat message', function(msg){
					$scope.messages.push(msg);
				});

				$scope.sendChatMessage = function() {
					if ($scope.currentMessage) {
						SocketService.emit('chat message', $scope.currentMessage);
						$scope.currentMessage = "";
					}
				}
			}]
		};
	});
})();