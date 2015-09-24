(function() {
	angular.module('cartel.services', ['btford.socket-io'])
		.factory('cartelSocket', function (socketFactory) {
			return socketFactory();
		});
})();