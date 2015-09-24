(function() {
	var app = angular.module('cartel', ['cartel.services']);

	app.directive('chat', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/components/chat.html',
			scope: {},
			controller: ['cartelSocket', '$scope', function(cartelSocket, $scope) {

				// Make random user name
				$scope.user = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
				
				console.log("Loading chat");
				console.log(cartelSocket);

				$scope.messages = [];

				cartelSocket.on('chat message', function(msg){
					$scope.messages.push(msg);
				});

				$scope.sendChatMessage = function() {
					if ($scope.currentMessage) {
						cartelSocket.emit('chat message', {
							user: $scope.user,
							message: $scope.currentMessage
						});
						$scope.currentMessage = "";
					}
				}
			}]
		};
	});
})();