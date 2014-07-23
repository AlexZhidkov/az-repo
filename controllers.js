var myApp = angular.module('Scorer', []);

myApp.controller('ScorerCtrl', ['$scope', '$window',
function ($scope, $window) {

    $scope.switchOnPoints = 7;
    $scope.team1 = {
        'name': 'East',
        'count': 0,
        'player1': 'East1',
        'player2': 'East2',
        'lastServed': ''
    };
    $scope.team2 = {
        'name': 'West',
        'count': 0,
        'player1': 'West1',
        'player2': 'West2',
        'lastServed': ''
    };

    $scope.history = [];

    $scope.Math = $window.Math;

    $scope.teamLeft = $scope.team1;
    $scope.teamRight = $scope.team2;

    $scope.lastScored = "teamLeft";
    $scope.nextServer = "player1";

    var isSwitched = true;

    $scope.historyAdd = function () {
        isSwitched = false;
        $scope.history.push({
            teamLeft: angular.copy($scope.teamLeft),
            teamRight: angular.copy($scope.teamRight),
            lastScored: $scope.lastScored,
            nextToServe: $scope.nextServer
        });
    };

    $scope.pointLeft = function () {
        $scope.teamLeft.count = $scope.teamLeft.count + 1;
        if ($scope.lastScored == "teamRight") {
            $scope.teamRight.lastServed = $scope.nextServer;
<<<<<<< HEAD
            if ($scope.teamLeft.lastServed == "teamLeft.player1") {
                $scope.nextServer = "teamLeft.player2"
            } else {
                $scope.nextServer = "teamLeft.player1"
=======
            if ($scope.teamLeft.lastServed == "player1") {
                $scope.nextServer = "player2"
            } else {
                $scope.nextServer = "player1"
>>>>>>> origin/master
            }
        }
        $scope.lastScored = "teamLeft";
        $scope.historyAdd();
    };

    $scope.pointRight = function () {
        $scope.teamRight.count = $scope.teamRight.count + 1;
        if ($scope.lastScored == "teamLeft") {
            $scope.teamLeft.lastServed = $scope.nextServer;
<<<<<<< HEAD
            if ($scope.teamRight.lastServed == "teamRight.player1") {
                $scope.nextServer = "teamRight.player2"
            } else {
                $scope.nextServer = "teamRight.player1"
=======
            if ($scope.teamRight.lastServed == "player1") {
                $scope.nextServer = "player2"
            } else {
                $scope.nextServer = "player1"
>>>>>>> origin/master
            }
        }
        $scope.lastScored = "teamRight";
        $scope.historyAdd();
    };

    $scope.undo = function () {
        $scope.history.splice($scope.history.length - 1, 1);

        var point = angular.copy($scope.history[$scope.history.length - 1]);

        $scope.teamLeft = point.teamLeft;
        $scope.teamRight = point.teamRight;
        $scope.lastScored = point.lastScored;
        $scope.nextServer = point.nextToServe;

        if ($scope.timeToSwitch()) {
            $scope.switchSides();
        }
    };

    $scope.switchSides = function () {
        teamTemp = $scope.teamLeft;
        $scope.teamLeft = $scope.teamRight;
        $scope.teamRight = teamTemp;
        if ($scope.lastScored == "teamLeft") {
            $scope.lastScored = "teamRight";
        } else {
            $scope.lastScored = "teamLeft";
        }
        isSwitched = true;
    };

    $scope.timeToSwitch = function () {
        if (isSwitched) {
            return false;
        }
        value = ($scope.teamLeft.count + $scope.teamRight.count) / $scope.switchOnPoints;
        return $scope.lastScored && value == $scope.Math.round(value);
    }

    $scope.historyAdd();
    isSwitched = true;

}]);
