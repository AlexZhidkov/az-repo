var scorerApp = angular.module('scorerApp', ['ngRoute', 'firebase']);

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
        .when('/stats', {
            templateUrl: 'pages/stats.html',
            controller: 'statsController'
        })
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'loginController'
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

scorerApp.controller('loginController', function ($scope, $firebase, $firebaseSimpleLogin) {
    $scope.message = 'Log In!';

    var ref = new Firebase("https://beachvolleyballgames.firebaseio.com");
    var auth = $firebaseSimpleLogin(ref);
    // log user in using the Facebook provider for Simple Login
    $scope.loginWithFacebook = function () {
        auth.$login("facebook").then(function (user) {
            console.log("Logged in as: " + user.uid);
        }, function (error) {
            console.error("Login failed: " + error);
        });
    }
});

scorerApp.controller('mainController', ['$scope', 'scorerModel', '$location', '$anchorScroll',
function ($scope, scorerModel, $location, $anchorScroll) {
    $scope.data = scorerModel;

    $location.hash('top');
    $anchorScroll();
}]);

scorerApp.controller('statsController', ['$scope', 'scorerModel', '$location', '$anchorScroll',
function ($scope, scorerModel, $location, $anchorScroll) {
    $scope.data = scorerModel;

    $location.hash('top');
    $anchorScroll();

    $scope.addPlayerStats = function (playerName) {
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

        $scope.data.statsDB.forEach(function (i) {
            if (i.player == playerName) {
                switch (i.id) {
                    case 1:
                        switch (i.value) {
                            case 1: serve1 += 1; break;
                            case 2: serve2 += 1; break;
                            case 3: serve3 += 1; break;
                        }
                    case 2:
                        switch (i.value) {
                            case 1: receive1 += 1; break;
                            case 2: receive2 += 1; break;
                            case 3: receive3 += 1; break;
                        }
                    case 3:
                        switch (i.value) {
                            case 1: set1 += 1; break;
                            case 2: set2 += 1; break;
                            case 3: set3 += 1; break;
                        }
                    case 4:
                        switch (i.value) {
                            case 1: attack1 += 1; break;
                            case 2: attack2 += 1; break;
                            case 3: attack3 += 1; break;
                        }
                    case 5:
                        switch (i.value) {
                            case 1: block1 += 1; break;
                            case 2: block2 += 1; break;
                            case 3: block3 += 1; break;
                        }
                }
            }
        });

        $scope.data.playerStats.push({
            player: playerName,
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

scorerApp.controller('scorerCtrl', [
    '$scope', '$window', 'scorerModel', '$location', '$anchorScroll',
    function ($scope, $window, scorerModel, $location, $anchorScroll) {
        $scope.data = scorerModel;
        $scope.Math = $window.Math;

        $scope.teamLeft = $scope.data.team1;
        $scope.teamRight = $scope.data.team2;

        $scope.teamLeft.setsWon = 0;
        $scope.teamRight.setsWon = 0;
        $scope.currentSet = 0;
        $scope.currentPointsToWin = 0;
        $scope.lastScored = "teamLeft";
        $scope.nextServer = "player1";
        $scope.gameEnding = "";

        $scope.stats = {
            serve: "",
            servePlayer: "",
            receive: "",
            receivePlayer: "",
            sets: [],
            attacks: [],
            blocks: []
        }

        $scope.data.playerStats = [];

        $scope.players = [$scope.teamLeft.player1, $scope.teamLeft.player2, $scope.teamRight.player1, $scope.teamRight.player2];
        $scope.teamLeft.count = 0;
        $scope.teamRight.count = 0;
        $scope.isSwitched = true;
        $scope.isGameStarted = false;
        $scope.startButtonMessage = "Start New Match";
        if ($scope.teamLeft.setsWon + $scope.teamRight.setsWon > 0 &&
            !($scope.teamLeft.setsWon == $scope.data.game.numberOfSets || $scope.teamRight.setsWon == $scope.data.game.numberOfSets)) {
            $scope.startButtonMessage = "Start New Set";
        }

        /*$timeout(gameTime, 60000);*/

        $location.hash('top');
        $anchorScroll();

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
            $scope.teamLeft.count += 1;
            if ($scope.lastScored == "teamRight") {
                $scope.teamRight.lastServed = $scope.nextServer;
                if ($scope.teamLeft.lastServed == "player1") {
                    $scope.nextServer = "player2";
                } else {
                    $scope.nextServer = "player1";
                }
            }
            $scope.lastScored = "teamLeft";
            $scope.postPoint();
        };

        $scope.pointRight = function () {
            $scope.teamRight.count += 1;
            if ($scope.lastScored == "teamLeft") {
                $scope.teamLeft.lastServed = $scope.nextServer;
                if ($scope.teamRight.lastServed == "player1") {
                    $scope.nextServer = "player2";
                } else {
                    $scope.nextServer = "player1";
                }
            }
            $scope.lastScored = "teamRight";
            $scope.postPoint();
        };

        $scope.postPoint = function () {
            $scope.sayScoreIfNotMuted();
            $scope.historyAdd();
            $scope.collectStats();

            $scope.gameEnding = "";
            if ($scope.teamLeft.count != $scope.teamRight.count) {
                if ($scope.teamLeft.count > $scope.teamRight.count) {
                    $scope.checkNextPoint($scope.teamLeft, $scope.teamRight);
                } else {
                    $scope.checkNextPoint($scope.teamRight, $scope.teamLeft);
                }
            }
        }

        $scope.checkNextPoint = function (team1, team2) {
            if (team1.count >= $scope.currentPointsToWin - 1 && team1.count > team2.count) {
                if (team1.setsWon == $scope.data.game.numberOfSets - 1) {
                    $scope.gameEnding = "Match Point";
                } else {
                    $scope.gameEnding = "Set Point";
                }
                $scope.speakIfNotMuted($scope.gameEnding);
            }
            if (team1.count >= $scope.currentPointsToWin && team1.count > team2.count + 1) {
                team1.setsWon = team1.setsWon + 1;
                $scope.gameEnding = "Team " + team1.name + " won!";
                $scope.speakIfNotMuted($scope.gameEnding);
                $scope.init();
            }
        }

        $scope.collectStats = function () {
            if ($scope.stats.serve) {
                $scope.data.statsDB.push({
                    id: 1,
                    player: $scope.stats.servePlayer,
                    value: $scope.getOutcomeValue($scope.stats.serve)
                });
                $scope.stats.serve = "";
                $scope.stats.servePlayer = $scope.getNextServerName();
            }

            if ($scope.stats.receive) {
                $scope.data.statsDB.push({
                    id: 2,
                    player: $scope.stats.receivePlayer,
                    value: $scope.getOutcomeValue($scope.stats.receive)
                });
                $scope.stats.receive = "";
                $scope.stats.receivePlayer = "";
            }

            $scope.stats.sets.forEach(function (set) {
                if (set.outcome) {
                    $scope.data.statsDB.push({
                        id: 3,
                        player: set.Player,
                        value: $scope.getOutcomeValue(set.outcome)
                    });
                }
            });
            $scope.stats.sets = [];
            $scope.addStatSet();

            $scope.stats.attacks.forEach(function (attack) {
                if (attack.outcome) {
                    $scope.data.statsDB.push({
                        id: 4,
                        player: attack.Player,
                        value: $scope.getOutcomeValue(attack.attack)
                    });
                }
            });
            $scope.stats.attacks = [];
            $scope.addStatAttack();

            $scope.stats.blocks.forEach(function (block) {
                $scope.data.statsDB.push({
                    id: 5,
                    player: block.player,
                    value: $scope.getOutcomeValue(block.outcome)
                });
            });
            $scope.stats.blocks = [];
            $scope.addStatBlock();
        }

        $scope.getNextServerName = function () {
            if ($scope.lastScored == "teamRight") {
                if ($scope.nextServer == "player1") {
                    return $scope.teamRight.player1;
                } else {
                    return $scope.teamRight.player2;
                }
            } else {
                if ($scope.nextServer == "player1") {
                    return $scope.teamLeft.player1;
                } else {
                    return $scope.teamLeft.player2;
                }
            }
        }

        $scope.getOutcomeValue = function (outcome) {
            switch (outcome) {
                case "Mistake":
                    return 1;
                case "In play":
                    return 2;
                case "Good":
                case "Kill":
                case "Ace":
                    return 3;
            }
            return 0;
        }

        $scope.addStatSet = function () {
            $scope.stats.sets.push({ player: "", outcome: "" });
        }

        $scope.addStatAttack = function () {
            $scope.stats.attacks.push({ player: "", outcome: "" });
        }

        $scope.addStatBlock = function () {
            $scope.stats.blocks.push({ player: "", outcome: "" });
        }

        $scope.undo = function () {
            $scope.data.history.pop();

            var point = angular.copy($scope.data.history[$scope.data.history.length - 1]);

            $scope.teamLeft = point.teamLeft;
            $scope.teamRight = point.teamRight;
            $scope.lastScored = point.lastScored;
            $scope.nextServer = point.nextToServe;

            if ($scope.timeToSwitch()) {
                $scope.switchEnds();
            }
        };

        $scope.switchEnds = function () {
            var teamTemp = $scope.teamLeft;
            $scope.teamLeft = $scope.teamRight;
            $scope.teamRight = teamTemp;
            if ($scope.lastScored == "teamLeft") {
                $scope.lastScored = "teamRight";
            } else {
                $scope.lastScored = "teamLeft";
            }
            $scope.isSwitched = true;
        }

        $scope.startGame = function () {
            $scope.isGameStarted = true;
            if ($scope.teamLeft.setsWon == $scope.data.game.numberOfSets || $scope.teamRight.setsWon == $scope.data.game.numberOfSets) {
                $scope.teamLeft.setsWon = 0;
                $scope.teamRight.setsWon = 0;
                $scope.currentSet = 0;
            }
            $scope.startDate = Date();
            $scope.firstServe = $scope.lastScored;
            $scope.currentSet += 1;
            $scope.stats.servePlayer = $scope.getNextServerName();

            if ($scope.teamLeft.setsWon == $scope.teamRight.setsWon && $scope.teamLeft.setsWon == $scope.data.game.numberOfSets - 1) {
                $scope.currentPointsToWin = $scope.data.game.pointsToWinDecidingSet;
                $scope.currentPointsToSwitch = $scope.data.game.switchOnPointsDecidingSet;
            }
            else {
                $scope.currentPointsToWin = $scope.data.game.pointsToWin;
                $scope.currentPointsToSwitch = $scope.data.game.switchOnPoints;
            }
        }

        $scope.timeToSwitch = function () {
            if ($scope.isSwitched) {
                return false;
            }
            var value = ($scope.teamLeft.count + $scope.teamRight.count) / $scope.currentPointsToSwitch;
            return $scope.lastScored && value == $scope.Math.round(value);
        }

        $scope.isChooseServer = function (team, teamSide) {
            return (!$scope.isGameStarted) || ((team.count == 1 && teamSide != $scope.firstServe) && (teamSide == $scope.lastScored));
        }

        $scope.isGameEnd = function () {
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

        $scope.gameTime = function () {
            /*return moment.utc(moment(Date().diff(moment($scope.startDate))).format("mm")
            */
        }

        $scope.getScoreMessage = function () {
            var text;
            if ($scope.lastScored == 'teamLeft') {
                text = $scope.teamLeft.count + ', ' + $scope.teamRight.count + '. Server is ';
                if ($scope.nextServer == 'player1') {
                    text += $scope.teamLeft.player1;
                } else {
                    text += $scope.teamLeft.player2;
                }
            } else {
                text = $scope.teamRight.count + ', ' + $scope.teamLeft.count + '. Server is ';
                if ($scope.nextServer == 'player1') {
                    text += $scope.teamRight.player1;
                } else {
                    text += $scope.teamRight.player2;
                }
            }
            return text;
        }

        $scope.sayScoreIfNotMuted = function () {
            if ($scope.data.game.speechIsOn) {
                $scope.sayScore();
            }
        }

        $scope.sayScore = function () {
            $scope.speak($scope.getScoreMessage());
            if ($scope.timeToSwitch()) {
                $scope.speak('Switch ends');
            }

            $scope.speak($scope.gameEnding);
        }

        $scope.speakIfNotMuted = function (msgToSay) {
            if ($scope.data.game.speechIsOn) {
                $scope.speak(msgToSay);
            }
        }

        $scope.speak = function (msgToSay) {
            if (msgToSay != "") {
                var msg = new window.SpeechSynthesisUtterance();
                msg.text = msgToSay;
                var voices = window.speechSynthesis.getVoices();
                msg.voice = voices[0]; // Note: some voices don't support altering params
                msg.voiceURI = 'native';
                msg.volume = 1; // 0 to 1
                msg.rate = 1; // 0.1 to 10
                msg.pitch = 2; //0 to 2
                msg.lang = 'en-US';

                window.speechSynthesis.speak(msg);
            }
        }

        var init = function () {
        };
        // runs once per controller instantiation
        init();

    }]);

