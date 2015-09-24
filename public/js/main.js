(function() {
	var app = angular.module('cartel', ['cartel.services']);

	app.directive('chat', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/components/chat.html',
			controller: ['cartelSocket', '$scope', function(cartelSocket, $scope) {
				
				console.log("Loading chat");
				console.log(cartelSocket);

				$scope.messages = ['hello', 'hello back', 'what?'];

				cartelSocket.on('chat message', function(msg){
					$scope.messages.push(msg);
				});

				$scope.sendChatMessage = function() {
					if ($scope.currentMessage) {
						cartelSocket.emit('chat message', $scope.currentMessage);
						$scope.currentMessage = "";
					}
				}
			}]
		};
	});
})();