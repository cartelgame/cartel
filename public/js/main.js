(function() {
	var app = angular.module('cartel', ['cartel.services']);

	app.directive('chat', function() {
		return {
			restrict: 'E',
			templateUrl: 'partials/components/chat.html',
			controller: ['cartelSocket', '$scope', function(cartelSocket, $scope) {
				cartelSocket.on('chat message', function(msg){
					console.log("Received message " + msg);
				});
				console.log("Loading chat");
				console.log(cartelSocket);

				$scope.sendChatMessage = function(msg) {
					cartelSocket.emit('chat message', msg);
				}
			}]
		};
	});
})();