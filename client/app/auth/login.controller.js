(function() {
	angular.module('cartel')
		.controller('LoginController', ['$location', 'AuthService', '$scope', LoginController]);

	function LoginController($location, AuthService, $scope) {
		console.log("Login Controller");

        (function initController() {
            // reset login status
            AuthService.ClearCredentials();
        })();

        $scope.login = function() {
            $scope.dataLoading = true;
            AuthService.Login($scope.user)
                .then(function(response) {
                    // Success
                    $location.path('/games');
                }, function(response) {
                    // Failure response
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                });
        };
	}
})();