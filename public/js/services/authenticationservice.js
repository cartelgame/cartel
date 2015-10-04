(function() {
	angular.module('cartel', ['ngCookies'])

		.factory('AuthenticationService', ['$http', '$cookieStore', '$rootScope', '$timeout',
			function() {
				var service = {};

		        service.Login = function Login(username, password, callback) {

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

		        service.SetCredentials = function SetCredentials(username, password) {
		            var authdata = Base64.encode(username + ':' + password);

		            $rootScope.globals = {
		                currentUser: {
		                    username: username,
		                    authdata: authdata
		                }
		            };

		            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
		            $cookieStore.put('globals', $rootScope.globals);
		        };

		        service.ClearCredentials = function ClearCredentials() {
		            $rootScope.globals = {};
		            $cookieStore.remove('globals');
		            $http.defaults.headers.common.Authorization = 'Basic ';
		        };

		        return service;
			}
		]);
})();