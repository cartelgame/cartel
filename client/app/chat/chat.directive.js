(function() {
	angular.module('cartel')
		.directive('chat', ChatDirective);

	function ChatDirective() {
		return {
			restrict: 'E',
			templateUrl: 'app/chat/chat.directive.html',
			controller: ['SocketService', '$scope', function(SocketService, $scope) {
				console.log("Loading chat");
				console.log(SocketService);

				$scope.messages = [];

				SocketService.on('chat message', function(msg){
					$scope.messages.push(msg);
				});

				$scope.sendChatMessage = function() {
					if ($scope.currentMessage) {
						SocketService.emit('chat message', $scope.currentMessage);
						$scope.currentMessage = "";
					}
				}
			}]
		};
	}
})();