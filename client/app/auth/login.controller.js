(function() {
	angular.module('cartel')
		.controller('LoginController', ['$location', 'AuthenticationService', 'FlashService', '$scope', LoginController]);

	function LoginController($location, AuthenticationService, FlashService, $scope) {
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
                    if (response.success) {
                        $location.path('/games');
                    } else {
                        FlashService.Error(response.message);
                        $scope.error = response.message;
                        $scope.dataLoading = false;
                    }
                }, function(response) {
                    // Failure
                });
        };
	}
})();