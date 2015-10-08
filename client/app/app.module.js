(function() {
	angular.module('cartel', ['ngRoute', 'ngCookies', 'btford.socket-io', 'base64', 'ngStorage'])
		.config(['$routeProvider', '$httpProvider',
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
})();