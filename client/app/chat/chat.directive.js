(function() {
	angular.module('cartel')
		.directive('chat', ChatDirective);

	function ChatDirective() {
		return {
			restrict: 'E',
			templateUrl: 'app/chat/chat.directive.html',
			controller: ['SocketService', 'SocketAuthService', '$scope', '$localStorage',
				function(SocketService, SocketAuthService, $scope, $localStorage) {
					console.log("Loading chat");
					console.log(SocketService);

					$scope.messages = [];

					SocketAuthService.getAuthenticatedAsPromise()
						.then(function(socket) {
							console.log('Done authenticating socket in Chat Controller');

							SocketService.socket.on('chat-message', function(msg){
								$scope.messages.push(msg);
								$scope.game.chatHistory.push(msg);
							});

							$scope.sendChatMessage = function() {
								if ($scope.currentMessage) {
									// Send chat message linked to specific game
									SocketService.socket.emit('chat-message', {
										message: $scope.currentMessage,
										game: $scope.gameId
									});

									// Print the message at our end
									$scope.game.chatHistory.push({
										playerName: $localStorage.user,
										message: $scope.currentMessage
									});

									$scope.currentMessage = "";
								}
							}
						});
				}]
		};
	}
})();