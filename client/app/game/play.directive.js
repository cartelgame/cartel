(function() {
	angular.module('cartel')
		.directive('ctPlay', PlayDirective);

	function PlayDirective() {
		return {
			restrict: 'E',
			templateUrl: 'app/game/play.directive.html',
			controller: ['SocketService', 'SocketAuthService', '$scope', 'GameService', PlayController]
		};
	}

	function PlayController(SocketService, SocketAuthService, $scope, GameService) {
		console.log("Loading play");

		SocketAuthService.getAuthenticatedAsPromise()
			.then(function success() {
				console.log('Done authentications socket in Play Controller');
				console.log('Getting game data');
				return GameService.GetById($scope.gameId);
			})
			.then(function success(game) {
				
			});
	}
})();