(function() {
	angular.module('cartel')
		.directive('ctLobby', LobbyDirective);

	function LobbyDirective() {
		return {
			restrict: 'E',
			templateUrl: 'app/game/lobby.directive.html',
			controller: ['SocketService', 'SocketAuthService', '$scope', 'GameService', LobbyController]
		};
	}

	function LobbyController(SocketService, SocketAuthService, $scope, GameService) {
		console.log("Loading lobby");

		$scope.everyoneReady = function() {
			if (!$scope.game || $scope.game.playerStates.length < 2) {
				return false;
			}
			return !(_.find($scope.game.playerStates, {ready: false}));
		};

		$scope.updateReadyStatus = function() {
			SocketService.socket.emit('player-ready', {
				ready: $scope.playerState.ready,
				game: $scope.gameId
			});
		};

		$scope.kickUser = function(playerName) {
			SocketService.socket.emit('kick-player', playerName);
			_.remove($scope.game.playerStates, {name: playerName});
		}
	}
})();