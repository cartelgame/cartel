(function() {
	angular.module('cartel')
		.controller('LoginController', ['$location', 'AuthenticationService', '$scope', LoginController]);

	function LoginController($location, AuthenticationService, $scope) {
		console.log("Login Controller");

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();

        $scope.login = function() {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.user)
                .then(function(response) {
                    // Success
                    $location.path('/games');
                }, function(response) {
                    // Failureresponse
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                });
        };
	}
})();