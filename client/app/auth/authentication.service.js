(function() {
	angular.module('cartel')
		.service('AuthenticationService', ['$http', '$rootScope', '$timeout', '$base64', '$localStorage', '$q', AuthenticationService]);

	function AuthenticationService($http, $rootScope, $timeout, $base64, $localStorage, $q) {
		this.Login = function(user) {
			var deferred = $q.defer();

			console.log("Authenticating user " + user.username);
            $http.post('/api/authenticate', user)
               	.then(function success(response) {
               		console.log("Authenticated with token " + response.data.token);
               		// Store the token
               		$localStorage.token = response.data.token;
               		$localStorage.user = user.username;

               		deferred.resolve();
               	}, function failure(response) {
               		// Determine the reason for the failure
               		var reason = '';
               		switch (response.status) {
               			case 401:
               				console.log('Failed to authenticat - invalid username/password');
               				reason = "Invalid username or password";
               				break;
               			default:
               				console.log('Failed to authenticat - error');
               				reason = "Some error happened";
               		}

               		deferred.reject(reason);
               	});

            return deferred.promise;
        };

        this.ClearCredentials = function() {
        	delete $localStorage.token;
        	delete $localStorage.user;
        };
	}
})();