(function() {
	angular.module('cartel')
		.factory('SocketService', function (socketFactory) {
			return socketFactory();
		});
})();