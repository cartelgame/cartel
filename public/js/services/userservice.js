(function() {
	angular.module('cartel')
		.factory('UserService', ['$http',
			function($http) {

				// private functions

		        function handleSuccess(res) {
		            return res.data;
		        }

		        function handleError(error) {
		            return function () {
		                return { success: false, message: error };
		            };
		        }

				var service = {};

				// TODO: These are taken from an example but don't think we need them all
		        service.GetAll = function GetAll() {
		            return $http.get('/api/users').then(handleSuccess, handleError('Error getting all users'));
		        };
		        service.GetById = function GetById(id) {
		            return $http.get('/api/users/' + id).then(handleSuccess, handleError('Error getting user by id'));
		        };
		        service.GetByUsername = function GetByUsername(username) {
		            return $http.get('/api/users/' + username).then(handleSuccess, handleError('Error getting user by username'));
		        };
		        service.Create = function Create(user) {
		            return $http.post('/api/users', user).then(handleSuccess, handleError('Error creating user'));
		        };
		        service.Update = function Update(user) {
		            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
		        };
		        service.Delete = function Delete(id) {
		            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
		        };

		        return service;
			}
		]);
})();