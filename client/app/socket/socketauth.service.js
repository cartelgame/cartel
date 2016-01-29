(function() {
	angular.module('cartel')
		.service('SocketAuthService', ['SocketService', '$q', SocketAuthService]);

	function SocketAuthService(SocketService, $q) {

		this.getAuthenticatedAsPromise = function() {
			var listenForAuthentication = function() {
				console.log('listening for socket authentication');
				var listenDeferred = $q.defer();
				SocketService.socket.on('authenticated', function() {
					console.log('listening for socket authentication - done');
					listenDeferred.resolve(true);
				});
				return listenDeferred.promise;
			};

			if (!SocketService.socket) {
				SocketService.initialize();
				return listenForAuthentication();
			} else {
				if (SocketService.getAuthenticated()) {
					return $q.when(true);
				} else {
					return listenForAuthentication();
				}
			}
		};
	}
})();