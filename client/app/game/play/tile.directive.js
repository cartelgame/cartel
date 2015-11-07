(function() {
	angular.module('cartel')
		.directive('ctTile', TileDirective);

	function TileDirective() {
		return {
			restrict: 'E',
			templateUrl: 'app/game/play/tile.directive.html',
			// transclude: true,
			scope: true,
			controller: ['$scope', TileController],
			link: function(scope, elem, attrs) {
				// Get the index attribute and attach it to the scope
				scope.tileIndex = attrs.index;
			}
		};
	}

	function TileController($scope) {
		console.log($scope.game);

		$scope.$watch('game', function(newValue, oldValue) {
			console.log('gello');
		});
	}
})();