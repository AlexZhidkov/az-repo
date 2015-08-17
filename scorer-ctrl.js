angular.module("scorerControllers", ["firebase"])
.controller('scorerCtrl', ['$scope', '$window', '$translate', 'scorerModel', '$firebase', '$location', '$anchorScroll',
    function ($scope, $window, $translate, scorerModel, $firebase, $location, $anchorScroll) {
        $scope.data = scorerModel;
        $scope.Math = $window.Math;

        $scope.data.game.teamLeft = $scope.data.team1;
        $scope.data.game.teamRight = $scope.data.team2;

        $scope.data.players = [$scope.data.game.teamLeft.player1, $scope.data.game.teamLeft.player2, $scope.data.game.teamRight.player1, $scope.data.game.teamRight.player2];

        if ($scope.data.game.teamLeft.setsWon + $scope.data.game.teamRight.setsWon > 0 &&
            !($scope.data.game.teamLeft.setsWon === $scope.data.gameSettings.numberOfSets || $scope.data.game.teamRight.setsWon === $scope.data.gameSettings.numberOfSets)) {
            $scope.data.game.startButtonMessage = "START_NEW_SET";
        }

        if (!$scope.data.game.startButtonMessage) {
            $scope.data.game.startButtonMessage = "START_NEW_MATCH";
        }
        /*$timeout(gameTime, 60000);*/

        $scope.isMobile = !$window.matchMedia("(min-width: 992px)").matches;

        if ($scope.isMobile) {
            $location.hash('top');
            $anchorScroll();
        }

        if ($scope.data.gameSettings.isCollectStats) {
            var refStats = new window.Firebase($scope.data.fireBase.root + '/stats');
            $scope.stats = $firebase(refStats);
        }

        //https://github.com/angular-translate/angular-translate/wiki/Dynamize-your-translations
        $translate(['MATCH_POINT', 'SET_POINT', 'TEAM', 'WON', 'SERVER_IS']).then(function (translations) {
            $scope.MATCH_POINT = translations.MATCH_POINT;
            $scope.SET_POINT = translations.SET_POINT;
            $scope.TEAM = translations.TEAM;
            $scope.WON = translations.WON;
            $scope.SERVER_IS = translations.SERVER_IS;
        });

        $scope.historyAdd = function () {
            $scope.data.history.push({
                teamLeft: angular.copy($scope.data.game.teamLeft),
                teamRight: angular.copy($scope.data.game.teamRight),
                lastScored: $scope.data.game.lastScored,
                nextToServe: $scope.data.game.nextServer
            });
        };

        $scope.setNextServer = function (scoredTeam) {
            $scope.data.game.prevServer = $scope.getLastServer();
            if ($scope.data.game.lastScored !== scoredTeam) {
                if (scoredTeam === "teamLeft") {
                    $scope.data.game.teamRight.lastServed = $scope.data.game.nextServer;
                } else {
                    $scope.data.game.teamLeft.lastServed = $scope.data.game.nextServer;
                }
                if ($scope.data.game[scoredTeam].lastServed == "player1") {
                    $scope.data.game.nextServer = "player2";
                } else {
                    $scope.data.game.nextServer = "player1";
                }
            }
            $scope.data.game.lastScored = scoredTeam;
        };

        $scope.assignPoint = function (team) {
            $scope.data.game[team].count += 1;
            $scope.data.game.isSwitched = false;
        };

        $scope.processPoint = function (team) {
            $scope.assignPoint(team);
            $scope.collectServerStat(team);
            $scope.setNextServer(team);
            $scope.updateScoreboard();
            $scope.sayScore(false);
            $scope.historyAdd();
            $scope.collectStats();
            $scope.checkNextPoint();
        };

        $scope.collectServerStat = function (team) {
            var server = $scope.getLastServer();
            server.servedTotal += 1;
            if ($scope.data.game.lastScored == team) {
                server.wonOnServe += 1;
            }
        };

        $scope.updateScoreboard = function () {
            if ($scope.data.gameSettings.isUseScoreboard) {
                $scope.data.gameSettings.scoresRef.update({
                    time: window.Firebase.ServerValue.TIMESTAMP,
                    name1: $scope.data.game.teamLeft.name,
                    name2: $scope.data.game.teamRight.name,
                    1: $scope.data.game.teamLeft.count,
                    2: $scope.data.game.teamRight.count
                });
            }
        };

        $scope.checkNextPoint = function () {
            $scope.data.game.gameEnding = "";
            var leadingTeam, loosingTeam;

            if ($scope.data.game.teamLeft.count == $scope.data.game.teamRight.count) {
                return;
            }

            if ($scope.data.game.teamLeft.count > $scope.data.game.teamRight.count) {
                leadingTeam = $scope.data.game.teamLeft;
                loosingTeam = $scope.data.game.teamRight;
            } else {
                leadingTeam = $scope.data.game.teamRight;
                loosingTeam = $scope.data.game.teamLeft;
            }

            if (leadingTeam.count >= $scope.data.game.currentPointsToWin - 1 && leadingTeam.count > loosingTeam.count) {
                if (leadingTeam.setsWon == $scope.data.gameSettings.numberOfSets - 1) {
                    $scope.data.game.gameEnding = $scope.MATCH_POINT;
                } else {
                    $scope.data.game.gameEnding = $scope.SET_POINT;
                }
            }
            if (leadingTeam.count >= $scope.data.game.currentPointsToWin && leadingTeam.count > loosingTeam.count + 1) {
                leadingTeam.setsWon = leadingTeam.setsWon + 1;
                $scope.data.game.gameEnding = $scope.TEAM + " " + leadingTeam.name + " " + $scope.WON + "!";
                $scope.finishSet();
            }
            $scope.speakIfNotMuted($scope.data.game.gameEnding);
        };

        $scope.pushStatsToDb = function (id, player, value) {
            if (player.id) {
                $scope.stats.$push({
                    s: $scope.data.appUser.id,
                    t: window.Firebase.ServerValue.TIMESTAMP,
                    i: id,
                    p: player.id,
                    v: value
                });
            }
        };

        $scope.collectStats = function () {
            var value = '';
            if ($scope.data.game.stats.serve) {
                value = $scope.data.game.stats.serve;
                $scope.data.statsDB.push({
                    i: 1,
                    p: ($scope.data.game.stats.servePlayer.id) ? $scope.data.game.stats.servePlayer.id : $scope.data.game.stats.servePlayer.nik,
                    v: value
                });
                $scope.pushStatsToDb(1, $scope.data.game.stats.servePlayer, value);
                $scope.data.game.stats.serve = "";
            }
            $scope.data.game.stats.servePlayer = $scope.data.game.prevServer;

            if ($scope.data.game.stats.receive) {
                value = $scope.data.game.stats.receive;
                $scope.data.statsDB.push({
                    i: 2,
                    p: $scope.data.game.stats.receivePlayer.id ? $scope.data.game.stats.receivePlayer.id : $scope.data.game.stats.receivePlayer.nik,
                    v: value
                });
                $scope.pushStatsToDb(2, $scope.data.game.stats.receivePlayer, value);
                $scope.data.game.stats.receive = "";
                $scope.data.game.stats.receivePlayer = "";
            }

            $scope.data.game.stats.sets.forEach(function (set) {
                if (set.outcome) {
                    value = set.outcome;
                    $scope.data.statsDB.push({
                        i: 3,
                        p: set.player.id ? set.player.id : set.player.nik,
                        v: value
                    });
                    $scope.pushStatsToDb(3, set.player, value);
                }
            });
            $scope.data.game.stats.sets = [];
            $scope.addStatSet();

            $scope.data.game.stats.attacks.forEach(function (attack) {
                if (attack.outcome) {
                    value = attack.outcome;
                    $scope.data.statsDB.push({
                        i: 4,
                        p: attack.player.id ? attack.player.id : attack.player.nik,
                        v: value
                    });
                    $scope.pushStatsToDb(4, attack.player, value);
                }
            });
            $scope.data.game.stats.attacks = [];
            $scope.addStatAttack();

            $scope.data.game.stats.blocks.forEach(function (block) {
                if (block.outcome) {
                    value = block.outcome;
                    $scope.data.statsDB.push({
                        i: 5,
                        p: block.player.id ? block.player.id : block.player.nik,
                        v: value
                    });
                    $scope.pushStatsToDb(5, block.player, value);
                }
            });
            $scope.data.game.stats.blocks = [];
            $scope.addStatBlock();
        };

        $scope.getLastServer = function () {
            return $scope.data.game[$scope.data.game.lastScored][$scope.data.game.nextServer];
        };

        /*
                $scope.getOutcomeValue = function(outcome) {
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
                };
        */

        $scope.addStatSet = function () {
            $scope.data.game.stats.sets.push({ player: "", outcome: "" });
        };

        $scope.addStatAttack = function () {
            $scope.data.game.stats.attacks.push({ player: "", outcome: "" });
        };

        $scope.addStatBlock = function () {
            $scope.data.game.stats.blocks.push({ player: "", outcome: "" });
        };

        $scope.undo = function () {
            $scope.data.history.pop();

            var point = angular.copy($scope.data.history[$scope.data.history.length - 1]);

            $scope.data.game.teamLeft = point.teamLeft;
            $scope.data.game.teamRight = point.teamRight;
            $scope.data.game.lastScored = point.lastScored;
            $scope.data.game.nextServer = point.nextToServe;

            if ($scope.timeToSwitch()) {
                $scope.switchEnds();
            }
        };

        $scope.switchEnds = function () {
            var teamTemp = $scope.data.game.teamLeft;
            $scope.data.game.teamLeft = $scope.data.game.teamRight;
            $scope.data.game.teamRight = teamTemp;
            if ($scope.data.game.lastScored === "teamLeft") {
                $scope.data.game.lastScored = "teamRight";
            } else {
                $scope.data.game.lastScored = "teamLeft";
            }
            $scope.updateScoreboard();
            $scope.data.game.isSwitched = true;
        };

        $scope.startGame = function () {
            $scope.data.game.isGameStarted = true;
            $scope.data.game.gameEnding = "";
            $scope.data.game.teamLeft.count = 0;
            $scope.data.game.teamRight.count = 0;
            $scope.data.history = [];

            if ($scope.data.game.teamLeft.setsWon == $scope.data.gameSettings.numberOfSets || $scope.data.game.teamRight.setsWon == $scope.data.gameSettings.numberOfSets) {
                $scope.data.game.teamLeft.setsWon = 0;
                $scope.data.game.teamRight.setsWon = 0;
                $scope.data.game.currentSet = 0;
            }
            $scope.startDate = Date();
            $scope.data.game.firstServe = $scope.data.game.lastScored;
            $scope.data.game.currentSet += 1;
            $scope.data.game.stats.servePlayer = $scope.getLastServer();

            if ($scope.data.game.teamLeft.setsWon == $scope.data.game.teamRight.setsWon && $scope.data.game.teamLeft.setsWon == $scope.data.gameSettings.numberOfSets - 1) {
                $scope.data.game.currentPointsToWin = $scope.data.gameSettings.pointsToWinDecidingSet;
                $scope.data.game.currentPointsToSwitch = $scope.data.gameSettings.switchOnPointsDecidingSet;
            } else {
                $scope.data.game.currentPointsToWin = $scope.data.gameSettings.pointsToWin;
                $scope.data.game.currentPointsToSwitch = $scope.data.gameSettings.switchOnPoints;
            }
        };

        $scope.timeToSwitch = function () {
            if ($scope.data.game.isSwitched) {
                return false;
            }
            var value = ($scope.data.game.teamLeft.count + $scope.data.game.teamRight.count) / $scope.data.game.currentPointsToSwitch;
            return $scope.data.game.lastScored && value == $scope.Math.round(value);
        };

        $scope.isChooseServer = function (teamSide) {
            return (!$scope.data.game.isGameStarted) || (($scope.data.game[teamSide].count == 1 && teamSide != $scope.data.game.firstServe) && (teamSide == $scope.data.game.lastScored));
        };

        /*
                $scope.isGameEnd = function () {
                    if ($scope.data.game.teamLeft.count >= $scope.data.game.currentPointsToWin && $scope.data.game.teamLeft.count > $scope.data.game.teamRight.count + 1) {
                        $scope.data.game.teamLeft.setsWon = $scope.data.game.teamLeft.setsWon + 1;
                        return true;
                    }
                    else if ($scope.data.game.teamRight.count >= $scope.data.game.currentPointsToWin && $scope.data.game.teamRight.count > $scope.data.game.teamLeft.count + 1) {
                        $scope.data.game.teamRight.setsWon = $scope.data.game.teamRight.setsWon + 1;
                        return true;
                    }
                    return false;
                }
        */

        $scope.gameTime = function () {
            /*return moment.utc(moment(Date().diff(moment($scope.startDate))).format("mm")
            */
        };

        $scope.getScoreMessage = function () {
            var text;
            if ($scope.data.game.lastScored == 'teamLeft') {
                text = $scope.data.game.teamLeft.count + ', ' + $scope.data.game.teamRight.count + '. ' + $scope.SERVER_IS + ' ';
                if ($scope.data.game.nextServer == 'player1') {
                    text += $scope.data.game.teamLeft.player1.nik;
                } else {
                    text += $scope.data.game.teamLeft.player2.nik;
                }
            } else {
                text = $scope.data.game.teamRight.count + ', ' + $scope.data.game.teamLeft.count + '. ' + $scope.SERVER_IS + ' ';
                if ($scope.data.game.nextServer == 'player1') {
                    text += $scope.data.game.teamRight.player1.nik;
                } else {
                    text += $scope.data.game.teamRight.player2.nik;
                }
            }
            return text + '. ';
        };

        $scope.sayScore = function (speakEvenIfMuted) {
            var msgToSay = $scope.getScoreMessage();
            if ($scope.timeToSwitch()) {
                msgToSay += 'Switch ends.';
            }

            msgToSay += $scope.data.game.gameEnding;

            if (speakEvenIfMuted || $scope.data.gameSettings.speechIsOn) {
                $scope.speak(msgToSay);
            }

            console.log("msgToSay = " + msgToSay);
            if ($scope.data.gameSettings.isUseScoreboard && msgToSay) {
                $scope.data.gameSettings.scoresRef.update({
                    message: msgToSay
                });
            }

        };

        $scope.whistle = function () {
            var audio = new Audio('audio_file.mp3');
            audio.play();
            $scope.collectStats();
        };

        $scope.speakIfNotMuted = function (msgToSay) {
            //push message to firebase
            if ($scope.data.gameSettings.isUseScoreboard && msgToSay) {
                $scope.data.gameSettings.scoresRef.update({
                    message: msgToSay
                });
            }

            if ($scope.data.gameSettings.speechIsOn) {
                $scope.speak(msgToSay);
            }
        };

        $scope.speak = function (msgToSay) {
            if (msgToSay != "") {
                var msg = new window.SpeechSynthesisUtterance(msgToSay);
                msg.lang = $translate.preferredLanguage();
                /*
                var msg = new window.SpeechSynthesisUtterance();
                msg.text = msgToSay;
                var voices = window.speechSynthesis.getVoices();
                msg.voice = voices[0]; // Note: some voices don't support altering params
                msg.voiceURI = 'native';
                msg.volume = 1; // 0 to 1
                msg.rate = 1; // 0.1 to 10
                msg.pitch = 2; //0 to 2
                msg.lang = 'en-US';
*/
                window.speechSynthesis.speak(msg);
            }
        };

        $scope.finishSet = function () {
            $scope.data.game.currentSet = 0;
            $scope.data.game.currentPointsToWin = 0;
            $scope.data.game.lastScored = "teamLeft";
            $scope.data.game.nextServer = "player1";
            $scope.data.game.isSwitched = true;
            $scope.data.game.isGameStarted = false;
            if ($scope.data.game.teamLeft.setsWon + $scope.data.game.teamRight.setsWon > 0 &&
                !($scope.data.game.teamLeft.setsWon == $scope.data.gameSettings.numberOfSets || $scope.data.game.teamRight.setsWon == $scope.data.gameSettings.numberOfSets)) {
                $scope.data.game.startButtonMessage = "START_NEW_SET";
            } else {
                $scope.data.game.startButtonMessage = "START_NEW_MATCH";
            }
        };

        if ($scope.data.gameSettings.isUseScoreboard && !$scope.data.gameSettings.scoresRef) {
            var refScore = new window.Firebase($scope.data.fireBase.root + '/score');
            $scope.data.gameSettings.scoresRef = refScore.push();
            $scope.updateScoreboard();
        }

    }]);

