(function() {
	angular.module('cartel')
		.controller('RegisterController', ['$location', '$scope', 'UserService', 'AuthenticationService', RegisterController]);

	function RegisterController($location, $scope, UserService, AuthenticationService) { 
        $scope.register = function() {
            $scope.dataLoading = true;
            UserService.Create($scope.user)
                .then(function (response) {
                    // We've successfully registered the user, so now let's login
                    AuthenticationService.Login($scope.user)
                        .then(function() {
                            $location.path('/games');
                        });
                }, function(response) {
                    // Failure
                    // TODO: handle failure
                    $scope.dataLoading = false;
                });
        }
	}
})();