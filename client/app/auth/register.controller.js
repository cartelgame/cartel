(function() {
	angular.module('cartel')
		.controller('RegisterController', ['$location', 'FlashService', '$scope', 'UserService', RegisterController]);

	function RegisterController($location, FlashService, $scope, UserService) { 
        $scope.register = function() {
            $scope.dataLoading = true;
            UserService.Create($scope.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/games');
                    } else {
                        FlashService.Error(response.message);
                        $scope.dataLoading = false;
                    }
                });
        }
	}
})();