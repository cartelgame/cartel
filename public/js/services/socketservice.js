(function() {
	angular.module('cartel.services', ['btford.socket-io'])
		.factory('SocketService', function (socketFactory) {
			return socketFactory();
		});
})();