(function() {
	angular.module('cartel', ['ngRoute', 'ngCookies', 'btford.socket-io', 'base64', 'ngStorage'])
		.config(['$routeProvider', '$httpProvider',
			function($routeProvider, $httpProvider) {
				$routeProvider
					.when('/login', {
						templateUrl: 'app/auth/login.view.html',
						controller: 'LoginController'
					})
					.when('/register', {
						templateUrl: 'app/auth/register.view.html',
						controller: 'RegisterController'
					})
					.when('/games', {
						templateUrl: 'app/game/gamelist.view.html',
						controller: 'GameListController'
					})
					.when('/games/:gameId', {
						templateUrl: 'app/game/game.view.html',
						controller: 'GameController'
					})
					.otherwise({
			        	redirectTo: '/login'
			      	});
			    $httpProvider.interceptors.push('TokenInterceptorService');
			}]);
})();