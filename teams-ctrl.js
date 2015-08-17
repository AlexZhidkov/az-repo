angular.module("teamsControllers", ["firebase"])
.controller('teamsController', ['$scope', '$window', '$translate', 'scorerModel', '$firebase', '$location', '$anchorScroll',
function ($scope, $window, $translate, scorerModel, $firebase, $location, $anchorScroll) {
    $scope.data = scorerModel;

    $scope.team1player1expanded = false;
    $scope.team1player2expanded = false;
    $scope.team2player1expanded = false;
    $scope.team2player2expanded = false;

    $scope.isMobile = !$window.matchMedia("(min-width: 992px)").matches;

    if ($scope.isMobile) {
        $location.hash('top');
        $anchorScroll();
    }

    $translate(['_AND_']).then(function (translations) {
        $scope._AND_ = translations._AND_;
    });

    var peopleRef = new Firebase($scope.data.fireBase.root + '/users');
    $scope.people = $firebase(peopleRef).$asArray();

    $scope.makeTeam1Name = function () {
        if ($scope.data.team1.player1.nik && $scope.data.team1.player2.nik) {
            $scope.data.team1.name = $scope.data.team1.player1.nik + $scope._AND_ + $scope.data.team1.player2.nik;
        }
    }

    $scope.makeTeam2Name = function () {
        if ($scope.data.team2.player1.nik && $scope.data.team2.player2.nik) {
            $scope.data.team2.name = $scope.data.team2.player1.nik + $scope._AND_ + $scope.data.team2.player2.nik;
        }
    }

    $scope.startNewMatch = function () {
        $scope.data.game.teamLeft.setsWon = 0;
        $scope.data.game.teamRight.setsWon = 0;
        $scope.data.game.currentSet = 0;
        $scope.data.game.currentPointsToWin = 0;
        $scope.data.game.lastScored = "teamLeft";
        $scope.data.game.nextServer = "player1";
        $scope.data.game.gameEnding = "";
        $scope.data.game.teamLeft.count = 0;
        $scope.data.game.teamRight.count = 0;
        $scope.data.game.isSwitched = true;
        $scope.data.game.isGameStarted = false;
        $scope.data.game.startButtonMessage = "START_NEW_MATCH";

        var refScore = new Firebase($scope.data.fireBase.root + '/score');
        $scope.data.gameSettings.scoresRef = refScore.push({
            time: Firebase.ServerValue.TIMESTAMP,
            name1: $scope.data.team1.name,
            name2: $scope.data.team2.name,
            1: 0,
            2: 0
        });


        $location.path('/liveScoring');
    };

}]);