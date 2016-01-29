(function() {
	angular.module('cartel')
		.controller('RegisterController', ['$location', '$scope', 'UserService', 'AuthService', RegisterController]);

	function RegisterController($location, $scope, UserService, AuthService) { 
        $scope.register = function() {
            $scope.dataLoading = true;
            UserService.Create($scope.user)
                .then(function success() {
                    AuthService.Login($scope.user)
                        .then(function() {
                            $location.path('/games');
                        });
                }, function failure(response) {
                    // TODO: handle failure
                    $scope.dataLoading = false;
                });
        }
	}
})();