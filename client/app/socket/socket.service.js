(function() {
	angular.module('cartel')
		.factory('SocketService', ['socketFactory', 'AuthService', SocketService]);

	function SocketService(socketFactory, AuthService) {
		// return socketFactory();

		var socket, ioSocket, isAuthenticated,
		self = {
			getAuthenticated: function() {
				return isAuthenticated;
			}
		};
		// by default the socket property is null and is not authenticated
		self.socket = socket;
		// initializer function to connect the socket for the first time after logging in to the app
		self.initialize = function() {
			console.log('initializing socket');

			isAuthenticated = false;

			self.socket = socket = socketFactory();

			//---------------------
			//these listeners will only be applied once when socket.initialize is called
			//they will be triggered each time the socket connects/re-connects (e.g. when logging out and logging in again)
			//----------------------
			socket.on('authenticated', function () {
				isAuthenticated = true;
				console.log('socket is jwt authenticated');
			});
			//---------------------
			socket.on('connect', function () {
				//send the jwt
				socket.emit('authenticate', {token: AuthService.getToken()});
			});
		};

		return self;
	}
})();