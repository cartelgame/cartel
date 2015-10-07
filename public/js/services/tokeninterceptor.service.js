(function() {
	angular.module('cartel')
		.service('TokenInterceptorService', ['$localStorage',
			function($localStorage) {

		        this.request = function(config) {
		        	config.headers['x-access-token'] = $localStorage.token;
		        	return config;
		        };

			}
		]);
})();