angular.module("statsControllers", ["firebase"])
.controller('statsController', ['$scope', '$window', '$translate', 'scorerModel', '$firebase', '$location', '$anchorScroll',
function ($scope, $window, $translate, scorerModel, $firebase, $location, $anchorScroll) {
    $scope.data = scorerModel;

    $scope.isMobile = !$window.matchMedia("(min-width: 992px)").matches;

    if ($scope.isMobile) {
        $location.hash('top');
        $anchorScroll();
    }

    var peopleRef = new Firebase($scope.data.fireBase.root + '/users');
    $scope.people = $firebase(peopleRef).$asArray();

    $scope.expanded = false;
    $scope.filterSearch = "";

    $scope.addPlayerStatsFromDb = function (key, person) {
        person.id = key;
        var ref = new Firebase($scope.data.fireBase.root + '/stats');
        var stats = $firebase(ref).$asArray();

        stats.$loaded().then(function () {
            $scope.addPlayerStats(person, stats);
        });
    }

    $scope.addPlayerStats = function (player, db) {
        var serve1 = 0;
        var serve2 = 0;
        var serve3 = 0;
        var receive1 = 0;
        var receive2 = 0;
        var receive3 = 0;
        var set1 = 0;
        var set2 = 0;
        var set3 = 0;
        var attack1 = 0;
        var attack2 = 0;
        var attack3 = 0;
        var block1 = 0;
        var block2 = 0;
        var block3 = 0;

        if (!db) {
            db = $scope.data.statsDB;
        }
        db.forEach(function (i) {
            if (i.p == player.id || i.p == player.nik) {
                switch (i.i) {
                    case 1:
                        switch (i.v) {
                            case 1: serve1 += 1; break;
                            case 2: serve2 += 1; break;
                            case 3: serve3 += 1; break;
                        }
                        break;
                    case 2:
                        switch (i.v) {
                            case 1: receive1 += 1; break;
                            case 2: receive2 += 1; break;
                            case 3: receive3 += 1; break;
                        }
                        break;
                    case 3:
                        switch (i.v) {
                            case 1: set1 += 1; break;
                            case 2: set2 += 1; break;
                            case 3: set3 += 1; break;
                        }
                        break;
                    case 4:
                        switch (i.v) {
                            case 1: attack1 += 1; break;
                            case 2: attack2 += 1; break;
                            case 3: attack3 += 1; break;
                        }
                        break;
                    case 5:
                        switch (i.v) {
                            case 1: block1 += 1; break;
                            case 2: block2 += 1; break;
                            case 3: block3 += 1; break;
                        }
                        break;
                }
            }
        });

        $scope.data.playerStats.push({
            player: player,
            serve: { 1: serve1, 2: serve2, 3: serve3 },
            receive: { 1: receive1, 2: receive2, 3: receive3 },
            set: { 1: set1, 2: set2, 3: set3 },
            attack: { 1: attack1, 2: attack2, 3: attack3 },
            block: { 1: block1, 2: block2, 3: block3 }
        });
    }

    $scope.clearStatsList = function () {
        $scope.data.playerStats = [];
    }

}]);
