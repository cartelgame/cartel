(function() {
	angular.module('cartel')

		.service('AuthenticationService', ['$http', '$cookieStore', '$rootScope', '$timeout', '$base64',
			function($http, $cookieStore, $rootScope, $timeout, $base64) {
		        this.Login = function Login(username, password, callback) {

		            /* Dummy authentication for testing, uses $timeout to simulate api call
		             ----------------------------------------------*/
		            // $timeout(function () {
		            //     var response;
		            //     UserService.GetByUsername(username)
		            //         .then(function (user) {
		            //             if (user !== null && user.password === password) {
		            //                 response = { success: true };
		            //             } else {
		            //                 response = { success: false, message: 'Username or password is incorrect' };
		            //             }
		            //             callback(response);
		            //         });
		            // }, 1000);

		            /* Use this for real authentication
		             ----------------------------------------------*/
		            $http.post('/api/authenticate', { username: username, password: password })
		               .success(function (response) {
		                   callback(response);
		               });

		        };

		        this.SetCredentials = function SetCredentials(username, password) {
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

		        this.ClearCredentials = function ClearCredentials() {
		            $rootScope.globals = {};
		            $cookieStore.remove('globals');
		            $http.defaults.headers.common.Authorization = 'Basic ';
		        };
			}
		]);
})();