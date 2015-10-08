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
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $location.path('/games');
                } else {
                    FlashService.Error(response.message);
                    $scope.error = response.message;
                    $scope.dataLoading = false;
                }
            });
        };
	}
})();