angular.module('scorerModels', ["ngCookies"])
    .service("scorerModel", ["$cookies", function ($cookies) {
        // Constructor
        //        function scorerModel() {

        this.team1 = {
                'name': '',
                'setsWon': 0,
                'count': 0,
                'player1': { id: '', nik: '', servedTotal: 0, wonOnServe: 0 },
                'player2': { id: '', nik: '', servedTotal: 0, wonOnServe: 0 },
                'lastServed': ''
            };
            this.team2 = {
                'name': '',
                'setsWon': 0,
                'count': 0,
                'player1': { id: '', nik: '', servedTotal: 0, wonOnServe: 0 },
                'player2': { id: '', nik: '', servedTotal: 0, wonOnServe: 0 },
                'lastServed': ''
            };

            this.gameSettings = {
                'numberOfSets': 2,
                'pointsToWin': 21,
                'pointsToWinDecidingSet': 15,
                'switchOnPoints': 7,
                'switchOnPointsDecidingSet': 5,
                'speechIsOn': ($cookies.speechIsOn === undefined) ? false : ($cookies.speechIsOn === 'true'),
                'isCollectStats': ($cookies.isCollectStats === undefined) ? true : ($cookies.isCollectStats === 'true'),
                'isShowInfo': ($cookies.isShowInfo === undefined) ? true : ($cookies.isShowInfo === 'true'),
                'isUseScoreboard': ($cookies.isUseScoreboard === undefined) ? true : ($cookies.isUseScoreboard === 'true'),
                'scoresRef': ''
            };

            this.game = {
                'teamLeft': '',
                'teamRight': '',
                'currentSet': 0,
                'currentPointsToWin': 0,
                'currentPointsToSwitch': 0,
                'firstServe': '',
                'lastScored': 'teamLeft',
                'nextServer': 'player1',
                'prevServer': '',
                'gameEnding': '',
                'isSwitched': true,
                'isGameStarted': false,
                'startButtonMessage': '', //"Start New Match",
                'stats': {
                    'serve': "",
                    'servePlayer': "",
                    'receive': "",
                    'receivePlayer': "",
                    'sets': [],
                    'attacks': [],
                    'blocks': []
                }
            };

            this.stat = {
                'id': 0,
                'player': '',
                'value': 0
            };

            this.playerStats = {
                player: { id: '', nik: '' },
                serve: { 1: 0, 2: 0, 3: 0 },
                receive: { 1: 0, 2: 0, 3: 0 },
                set: { 1: 0, 2: 0, 3: 0 },
                attack: { 1: 0, 2: 0, 3: 0 },
                block: { 1: 0, 2: 0, 3: 0 }
            };

            this.playerStats = [];
            this.players = [];
            this.statsDB = [];

            this.fireBase = {
                'root': "https://beachvolleyballgames.firebaseio.com",
                'loginObj': ""
            };

            this.appUser = {
                id: '',
                name: '',
                nik: '',
            };

//        }

/*
        scorerModel.prototype.playerDb = function () {
            return {
                id: '',
                nik: '',
                name: ''
            };
        };
*/

//        return scorerModel;

    }]);