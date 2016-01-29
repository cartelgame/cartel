(function() {
	angular.module('cartel')
		.service('AuthService', ['$http', '$localStorage', '$q', AuthService]);

	function AuthService($http, $localStorage, $q) {
		this.Login = function(user) {
			var deferred = $q.defer();

			console.log("Authenticating user " + user.username);
			$http.post('/api/authenticate', user)
				.then(function success(response) {
					console.log("Authenticated with token " + response.data.token);
					// Store the token
					$localStorage.token = response.data.token;
					$localStorage.playerName = user.username;

					deferred.resolve();
				}, function failure(response) {
					// Determine the reason for the failure
					var reason = '';
					switch (response.status) {
						case 401:
							console.log('Failed to authenticate - invalid username/password');
							reason = "Invalid username or password";
							break;
						default:
							console.log('Failed to authenticate - error');
							reason = "Some error happened";
					}

					deferred.reject(reason);
				});

			return deferred.promise;
		};

		this.clearCredentials = function() {
			delete $localStorage.token;
			delete $localStorage.playerName;
		};

		this.getToken = function() {
			return $localStorage.token;
		}

		this.getPlayerName = function() {
			return $localStorage.playerName;
		}
	}
})();