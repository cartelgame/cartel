(function() {
	angular.module('cartel')
		.controller('RegisterController', ['$location', '$scope', 'UserService', 'AuthService', RegisterController]);

	function RegisterController($location, $scope, UserService, AuthService) { 
        $scope.register = function() {
            $scope.dataLoading = true;
            UserService.Create($scope.user)
                .then(function (response) {
                    // We've successfully registered the user, so now let's login
                    AuthService.Login($scope.user)
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