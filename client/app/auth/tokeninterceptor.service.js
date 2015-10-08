(function() {
	angular.module('cartel')
		.service('TokenInterceptorService', ['$localStorage', TokenIntercepterService]);

	function TokenIntercepterService($localStorage) {
        this.request = function(config) {
        	config.headers['x-access-token'] = $localStorage.token;
        	return config;
        };
	}
})();