(function() {
	angular.module('cartel')
		.directive('ct-chat', ChatDirective);

	function ChatDirective() {
		return {
			restrict: 'E',
			templateUrl: 'app/chat/chat.directive.html',
			controller: ['SocketService', 'SocketAuthService', '$scope', 'AuthService',
				function(SocketService, SocketAuthService, $scope, AuthService) {
					console.log("Loading chat");
					console.log(SocketService);

					$scope.messages = [];

					$scope.sendChatMessage = function() {
						if ($scope.currentMessage) {
							// Send chat message linked to specific game
							SocketService.socket.emit('chat-message', {
								message: $scope.currentMessage,
								game: $scope.gameId
							});

							// Print the message at our end
							$scope.game.chatHistory.push({
								playerName: AuthService.getPlayerName(),
								message: $scope.currentMessage
							});

							$scope.currentMessage = "";
						}
					}

					SocketAuthService.getAuthenticatedAsPromise()
						.then(function(socket) {
							$scope.connected = true;
							console.log('Done authenticating socket in Chat Controller');

							SocketService.socket.on('chat-message', function(msg){
								$scope.messages.push(msg);
								$scope.game.chatHistory.push(msg);
							});
						});
				}]
		};
	}
})();