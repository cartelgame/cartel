(function() {
	angular.module('cartel')
		.directive('ctBoard', BoardDirective);

	function BoardDirective() {
		return {
			restrict: 'E',
			templateUrl: 'app/game/play/board.directive.html',
			controller: ['SocketService', 'SocketAuthService', '$scope', 'AuthService', BoardController]
		};
	}

	function BoardController($scope) {

	}
})();