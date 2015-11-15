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
		$scope.isCornerTile = function() {
			return $scope.tileIndex % 10 === 0;
		}

		$scope.isVerticalTile = function() {
			return $scope.tileIndex < 10 || ($scope.tileIndex > 20 && $scope.tileIndex < 30);
		}

		$scope.isHorizontalTile = function() {
			return !$scope.isCornerTile() && !$scope.isVerticalTile();
		}
	}
})();