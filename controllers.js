var myApp = angular.module('Scorer', []);

myApp.controller('ScorerCtrl', ['$scope', '$window',
function ($scope, $window) {

    $scope.switchOnPoints = 7;
    $scope.team1 = {
        'name': 'East',
        'count': 0,
        'player1': 'Person11',
        'player2': 'Person12',
        'lastServed': ''
    };
    $scope.team2 = {
        'name': 'West',
        'count': 0,
        'player1': 'Person21',
        'player2': 'Person22',
        'lastServed': ''
    };
    $scope.teamTemp = {
        'name': '',
        'count': 0,
        'player1': '',
        'player2': '',
        'lastServed': ''
    };

    $scope.Math = $window.Math;

    $scope.teamLeft = $scope.team1;
    $scope.teamRight = $scope.team2;

    $scope.lastScored = "";
    $scope.serveLeft1 = "O";
    $scope.nextServer = "teamLeft.player1";

    $scope.pointLeft = function () {
        $scope.teamLeft.count = $scope.teamLeft.count + 1;
        if ($scope.lastScored == "teamRight") {
            $scope.teamRight.lastServed = $scope.nextServer;
            if ($scope.teamLeft.lastServed == "teamLeft.player1") {
                $scope.nextServer = "teamLeft.player2"
            } else {
                $scope.nextServer = "teamLeft.player1"
            }
        }
        $scope.lastScored = "teamLeft";
    };

    $scope.pointRight = function () {
        $scope.teamRight.count = $scope.teamRight.count + 1;
        if ($scope.lastScored == "teamLeft") {
            $scope.teamLeft.lastServed = $scope.nextServer;
            if ($scope.teamRight.lastServed == "teamRight.player1") {
                $scope.nextServer = "teamRight.player2"
            } else {
                $scope.nextServer = "teamRight.player1"
            }
        }
        $scope.lastScored = "teamRight";
    };

    $scope.undo = function () {
        if ($scope.lastScored == "teamLeft") {
            $scope.teamLeft.count = $scope.teamLeft.count - 1;
        }
        else if ($scope.lastScored == "teamRight") {
            $scope.teamRight.count = $scope.teamRight.count - 1;
        }
        $scope.lastScored = "";
    };

    $scope.switchSides = function () {
        $scope.teamTemp = $scope.teamLeft;
        $scope.teamLeft = $scope.teamRight;
        $scope.teamRight = $scope.teamTemp;
        $scope.lastScored = "";
    };

    $scope.timeToSwitch = function () {
        value = ($scope.team1.count + $scope.team2.count) / $scope.switchOnPoints;
        return $scope.lastScored && value == $scope.Math.round(value);
    }

}]);