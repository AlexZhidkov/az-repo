var scorerApp = angular.module('scorerApp', ['ngRoute']);

// configure routes
scorerApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'mainController'
        })
        .when('/setup', {
            templateUrl: 'pages/setup.html',
            controller: 'mainController'
        })
        .when('/pickTeams', {
            templateUrl: 'pages/teams.html',
            controller: 'mainController'
        })
        .when('/liveScoring', {
            templateUrl: 'pages/scoring.html',
            controller: 'scorerCtrl'
        })
        .when('/about', {
            templateUrl: 'pages/about.html',
            controller: 'aboutController'
        })
        .when('/contact', {
            templateUrl: 'pages/contact.html',
            controller: 'contactController'
        });
});

scorerApp.controller('aboutController', function ($scope) {
    $scope.message = 'About Controller';
});

scorerApp.controller('pickTeamsCtrl', function ($scope) {
    $scope.teamsSet = true;

});

scorerApp.controller('contactController', function ($scope) {
    $scope.message = 'Contact us!';
});

scorerApp.controller('mainController', ['$scope', 'scorerModel',
function ($scope, scorerModel) {
    $scope.data = scorerModel;
    $scope.message = 'Main Controller';
}]);

scorerApp.controller('scorerCtrl', ['$scope', '$window', 'scorerModel',
function ($scope, $window, scorerModel) {
    $scope.data = scorerModel;
    $scope.Math = $window.Math;

    $scope.teamLeft = $scope.data.team1;
    $scope.teamRight = $scope.data.team2;

    $scope.teamLeft.setsWon = 0;
    $scope.teamRight.setsWon = 0;
    $scope.currentSet = 0;
    $scope.lastScored = "teamLeft";
    $scope.nextServer = "player1";

    $scope.init = function () {
        $scope.teamLeft.count = 0;
        $scope.teamRight.count = 0;
        $scope.isSwitched = true;
        $scope.isGameStarted = false;

    };
    // runs once per controller instantiation
    $scope.init();

    $scope.historyAdd = function () {
        $scope.isSwitched = false;
        $scope.data.history.push({
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
            if ($scope.teamLeft.lastServed == "player1") {
                $scope.nextServer = "player2"
            } else {
                $scope.nextServer = "player1"
            }
        }
        $scope.lastScored = "teamLeft";
        $scope.historyAdd();
    };

    $scope.pointRight = function () {
        $scope.teamRight.count = $scope.teamRight.count + 1;
        if ($scope.lastScored == "teamLeft") {
            $scope.teamLeft.lastServed = $scope.nextServer;
            if ($scope.teamRight.lastServed == "player1") {
                $scope.nextServer = "player2"
            } else {
                $scope.nextServer = "player1"
            }
        }
        $scope.lastScored = "teamRight";
        $scope.historyAdd();
    };

    $scope.undo = function () {
        $scope.data.history.pop();

        var point = angular.copy($scope.data.history[$scope.data.history.length - 1]);

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
        $scope.isSwitched = true;
    };

    $scope.startGame = function () {
        $scope.isGameStarted = true;
        $scope.firstServe = $scope.lastScored;
        $scope.currentSet = $scope.currentSet + 1;
    }

    $scope.timeToSwitch = function () {
        if ($scope.isSwitched) {
            return false;
        }
        value = ($scope.teamLeft.count + $scope.teamRight.count) / $scope.data.game.switchOnPoints;
        return $scope.lastScored && value == $scope.Math.round(value);
    }

    $scope.isGameEnd = function () {
        if ($scope.currentSet == $scope.data.game.numberOfSets) {
            $scope.currentPointsToWin = $scope.data.game.pointsToWinLastSet;
        }
        else {
            $scope.currentPointsToWin = $scope.data.game.pointsToWin;
        }
        if ($scope.teamLeft.count >= $scope.currentPointsToWin && $scope.teamLeft.count > $scope.teamRight.count + 1) {
            $scope.teamLeft.setsWon = $scope.teamLeft.setsWon + 1;
            $scope.init();
            return true;
        }
        else if ($scope.teamRight.count >= $scope.currentPointsToWin && $scope.teamRight.count > $scope.teamLeft.count + 1) {
            $scope.teamRight.setsWon = $scope.teamRight.setsWon + 1;
            $scope.init();
            return true;
        }
        return false;
    }


}]);

