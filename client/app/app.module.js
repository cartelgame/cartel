(function() {
	angular.module('cartel', ['ngRoute', 'ngCookies', 'btford.socket-io', 'base64', 'ngStorage', 'mgcrea.ngStrap.alert', 'ngAnimate'])
		.config(['$routeProvider', '$httpProvider', AppConfig]);

	function AppConfig($routeProvider, $httpProvider) {
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
				templateUrl: 'app/game/list/gamelist.view.html',
				controller: 'GameListController'
			})
			.when('/games/:gameId', {
				templateUrl: 'app/game/lobby/lobby.view.html',
				controller: 'LobbyController'
			})
			.when('/games/:gameId/play', {
				templateUrl: 'app/game/play/game.view.html',
				controller: 'GameController'
			})
			.otherwise({
	        	redirectTo: '/login'
	      	});
	    $httpProvider.interceptors.push('TokenInterceptorService');
	}
})();