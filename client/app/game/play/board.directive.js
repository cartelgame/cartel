(function() {
	angular.module('cartel')
		.directive('ctBoard', BoardDirective);

	function BoardDirective() {
		return {
			restrict: 'E',
			templateUrl: 'app/game/play/board.directive.html',
			controller: ['$scope', 'SocketService', 'SocketAuthService', 'AuthService',BoardController]
		};
	}

	function BoardController($scope) {
		$scope.gameboard = {imagePath:"assets/img/cartel.jpg",originalPath:"assets/img/cartel.jpg"};
	}
})();