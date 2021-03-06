(function() {
	angular.module('cartel')
		.controller('LoginController', ['$location', 'AuthService', '$scope', '$alert', LoginController]);

	function LoginController($location, AuthService, $scope, $alert) {
		console.log("Login Controller");

        (function initController() {
            // reset login status
            AuthService.clearCredentials();
        })();

        $scope.login = function() {
            $scope.dataLoading = true;
            AuthService.Login($scope.user)
                .then(function success() {
                    $location.path('/games');
                }, function failure(err) {
                    $scope.error = err.message;
                    $scope.dataLoading = false;
                });
        };

        $scope.alertTest = function() {
            var myAlert = $alert({
                title: 'Holy guacamole!', 
                content: 'Best check yo self, you\'re not looking too good.', 
                placement: 'top-right', 
                type: 'info', 
                show: true,
                container: 'alerts',
                duration: 4,
                animation: 'am-fade-and-scale'
            });
        }
	}
})();