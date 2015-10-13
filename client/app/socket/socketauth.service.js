(function() {
	angular.module('cartel')
		.factory('SocketAuthService', function(SocketService, $q) {
			return {
				getAuthenticatedAsPromise:function() {

					var listenForAuthentication = function() {
						console.log('listening for socket authentication');
						var listenDeferred = $q.defer();
						var authCallback = function() {
							console.log('listening for socket authentication - done');
							listenDeferred.resolve(true);
						};
						SocketService.socket.on('authenticated', authCallback);
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
				}
			};
		});
})();