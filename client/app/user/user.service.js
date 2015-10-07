(function() {
	angular.module('cartel')
		.service('UserService', ['$http',
			function($http) {

		        function handleSuccess(res) {
		            return res.data;
		        }

		        function handleError(error) {
		            return function () {
		                return { success: false, message: error };
		            };
		        }

				// TODO: These are taken from an example but don't think we need them all
		        this.GetAll = function GetAll() {
		            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
		        };
		        this.GetById = function GetById(id) {
		            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
		        };
		        this.GetByUsername = function GetByUsername(username) {
		            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
		        };
		        this.Create = function Create(user) {
		            return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));
		        };
		        this.Update = function Update(user) {
		            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
		        };
		        this.Delete = function Delete(id) {
		            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
		        };

			}
		]);
})();