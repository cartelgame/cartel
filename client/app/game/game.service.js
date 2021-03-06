(function() {
	angular.module('cartel')
		.service('GameService', ['$http', '$location', GameService]);

	function GameService($http, $location) {

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function (response) {
                console.log(response)
                // TODO: should be a better way of redirecting after failed token?
                if (response.status == 403) {
                    $location.path('/login');
                } else {
                    return { success: false, message: error };
                }
            };
        }

        this.GetAll = function GetAll() {
            return $http.get('/api/games').then(handleSuccess, handleError('Error getting all games'));
        };
        this.GetById = function GetById(id) {
            return $http.get('/api/games/' + id).then(handleSuccess, handleError('Error getting game by id'));
        };
        this.Create = function Create(name) {
            return $http.post('/api/games', {
            	name: name
            })
            .then(handleSuccess, handleError('Error creating game'));
        };
        this.Update = function Update(game) {
            return $http.put('/api/games/' + game.id, game).then(handleSuccess, handleError('Error updating game'));
        };
        this.Delete = function Delete(id) {
            return $http.delete('/api/games/' + id).then(handleSuccess, handleError('Error deleting game'));
        };

	}
})();