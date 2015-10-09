(function() {
	angular.module('cartel')
		.service('AuthenticationService', ['$http', '$cookieStore', '$rootScope', '$timeout', '$base64', '$localStorage', AuthenticationService]);

	function AuthenticationService($http, $cookieStore, $rootScope, $timeout, $base64, $localStorage) {
		this.Login = function(username, password, callback) {

		            $http.post('/api/authenticate', { username: username, password: password })
		               	.then(function success(response) {
		               		// Store the token
		               		$localStorage.token = response.data.token;
		               		$localStorage.user = username;

		                   	callback({
		                   		success: true
		                   	});
		               	}, function failure(response) {
		               		// Determine the reason for the failure
		               		var reason = '';
		               		switch (response.status) {
		               			case 401:
		               				reason = "Invalid username or password";
		               				break;
		               			default:
		               				reason = "Some error happened";
		               		}

		               		callback({
		               			succes: false,
		               			message: reason
		               		})
		               	});

		        };

		        this.SetCredentials = function(username, password) {
		            var authdata = $base64.encode(username + ':' + password);

		            $rootScope.globals = {
		                currentUser: {
		                    username: username,
		                    authdata: authdata
		                }
		            };

		            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
		            $cookieStore.put('globals', $rootScope.globals);
		        };

		        this.ClearCredentials = function() {
		            $rootScope.globals = {};
		            $cookieStore.remove('globals');
		            $http.defaults.headers.common.Authorization = 'Basic ';
		        };
	}
})();