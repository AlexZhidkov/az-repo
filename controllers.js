var myApp = angular.module('Scorer', []);

myApp.controller('ScorerCtrl', ['$scope', 
function ($scope) {
    $scope.prompt = 'Score: ';
	$scope.count1 = 0;
	$scope.count2 = 0;
	$scope.team1 = "Team 1";
	$scope.team2 = "Team 2";
	$scope.lastScored = "";
	
    $scope.pointLeft = function() {
        $scope.count1 = $scope.count1 + 1;
		$scope.lastScored = "team1"
    };

    $scope.pointRight = function() {
        $scope.count2 = $scope.count2 + 1;
		$scope.lastScored = "team2"
    };
	
    $scope.undo = function() {
		if($scope.lastScored == "team1"){	
			$scope.count1 = $scope.count1 -1;
		}
		else if($scope.lastScored == "team2"){	
			$scope.count2 = $scope.count2 -1;
		}
		$scope.lastScored = "";
    };


}]);