(function() {
	'use strict';
	var app = angular.module('cartel', ['ngRoute', 'ngCookies', 'btford.socket-io', 'base64', 'ngStorage']);

	app.config(['$routeProvider', '$httpProvider',
		function($routeProvider, $httpProvider) {
			$routeProvider.
				when('/login', {
					templateUrl: 'partials/views/login.html',
					controller: 'LoginController'
				}).
				when('/register', {
					templateUrl: 'partials/views/register.html',
					controller: 'RegisterController'
				}).
				when('/games', {
					templateUrl: 'partials/views/games.html',
					controller: 'GameListController'
				}).
				when('/games/:gameId', {
					templateUrl: 'partials/views/game.html',
					controller: 'GameController'
				}).
				otherwise({
		        	redirectTo: '/login'
		      	});
		    $httpProvider.interceptors.push('TokenInterceptorService');
		}]);



	app.controller('LoginController', ['$location', 'AuthenticationService', 'FlashService', '$scope',
		function($location, AuthenticationService, FlashService, $scope) {
			console.log("Login Controller");

	        (function initController() {
	            // reset login status
	            AuthenticationService.ClearCredentials();
	        })();

	        $scope.login = function() {
	            $scope.dataLoading = true;
	            AuthenticationService.Login($scope.username, $scope.password, function (response) {
	                if (response.success) {
	                    AuthenticationService.SetCredentials($scope.username, $scope.password);
	                    $location.path('/games');
	                } else {
	                    FlashService.Error(response.message);
	                    $scope.error = response.message;
	                    $scope.dataLoading = false;
	                }
	            });
	        };
		}]);

	app.controller('RegisterController', ['$location', 'FlashService', '$scope', 'UserService',
		function($location, FlashService, $scope, UserService) { 
	        $scope.register = function() {
	            $scope.dataLoading = true;
	            UserService.Create($scope.user)
	                .then(function (response) {
	                    if (response.success) {
	                        FlashService.Success('Registration successful', true);
	                        $location.path('/login');
	                    } else {
	                        FlashService.Error(response.message);
	                        $scope.dataLoading = false;
	                    }
	                });
	        }
		}]);

	app.controller('GameListController', ['$scope', '$http', '$location', '$routeParams', 'GameService',
		function($scope, $http, $location, $routeParams, GameService) {
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
		}]);

	app.controller('GameController', ['$scope', '$http', '$location', '$routeParams',
		function($scope, $http, $location, $routeParams) {
			// $scope.gameId = $routeParams.gameId;

			// $http({
			// 	url: '/game',
			// 	method: 'GET',
			// 	params: { gameId: $scope.gameId }
			// })
			// .then(function(response) {

			// }, function(response) {
			// 	// TODO handle error
			// 	console.log("Error getting game");
			// });
		}]);

	app.directive('chat', function() {
		return {
			restrict: 'E',
			templateUrl: 'app/chat/chat.directive.html',
			scope: {},
			controller: ['SocketService', '$scope', function(SocketService, $scope) {

				// console.log("Loading chat");
				// console.log(SocketService);

				// $scope.messages = [];

				// SocketService.on('chat message', function(msg){
				// 	$scope.messages.push(msg);
				// });

				// $scope.sendChatMessage = function() {
				// 	if ($scope.currentMessage) {
				// 		SocketService.emit('chat message', $scope.currentMessage);
				// 		$scope.currentMessage = "";
				// 	}
				// }
			}]
		};
	});
})();