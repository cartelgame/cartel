(function() {
	angular.module('cartel')
		.controller('LoginController', ['$location', 'AuthService', '$scope', '$alert','$http', LoginController]);

	function LoginController($location, AuthService, $scope, $alert,$http) {
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

        $scope.resetTileSet = function() {
            $http.get('/api/resetTileSet').then(function(response){
                onError(response.data);
            },onError);            
        }
        function onError(error){
            var myAlert = $alert({
                title: 'Holy guacamole!', 
                content: error, 
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