(function() {
	var app = angular.module('cartel', ['cartel.services', 'ngRoute']);

	app.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
				when('/servers', {
					templateUrl: 'partials/views/servers.html',
					controller: 'ServerController'
				}).
				when('/servers/:gameId', {
					templateUrl: 'partials/views/game.html',
					controller: 'GameController'
				}).
				// when('/terms/:uprn', {
				// 	templateUrl: 'partials/pages/terms.html',
				// 	controller: 'TermsController'
				// }).
				// when('/property/:uprn', {
				// 	templateUrl: 'partials/pages/property.html',
				// 	controller: 'PropertyController'
				// }).
				otherwise({
		        	redirectTo: '/servers'
		      	});
		}]);


	app.controller('ServerController', ['$scope', '$http', '$location', '$routeParams',
		function($scope, $http, $location, $routeParams) {
			$http.get('/servers')
				.then(function(response) {
					$scope.games = response.data;
				}, function(response) {
					// TODO handle error
					console.log("Error getting servers list");
				});
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