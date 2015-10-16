(function() {
	angular.module('cartel')
		.controller('RegisterController', ['$location', 'FlashService', '$scope', 'UserService', 'AuthenticationService', RegisterController]);

	function RegisterController($location, FlashService, $scope, UserService, AuthenticationService) { 
        $scope.register = function() {
            $scope.dataLoading = true;
            UserService.Create($scope.user)
                .then(function (response) {
                    // TODO: what's this FlashService all about?
                    FlashService.Success('Registration successful', true);
                    
                    // We've successfully registered the user, so now let's login
                    AuthenticationService.Login($scope.user)
                        .then(function(response) {
                            $location.path('/games');
                        });
                }, function(response) {
                    // Failure
                    // TODO: do something
                    FlashService.Error(response.message);
                    $scope.dataLoading = false;
                });
        }
	}
})();