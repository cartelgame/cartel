(function() {
	angular.module('cartel')
		.controller('GameController', ['$scope', '$http', '$location', '$routeParams', GameController]);

	function GameController($scope, $http, $location, $routeParams) {
		// $scope.gameId = $routeParams.gameId;

		// $http({
		// 	url: '/game',
		// 	method: 'GET',
		// 	params: { gameId: $scope.gameId }
		// })
		// .then(function(response) {

		// }, function(response) {
		// 	// TODO handle error
		// 	console.log("Error getting game");
		// });
	}
})();