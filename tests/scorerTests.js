describe('Unit: scorerCtrl', function () {

    window.beforeEach(function () {
        window.module('scorerApp', function ($translateProvider) {
            $translateProvider.translations('en', {
                'TEAM': 'Team',
                'WON': 'won'
            });
            $translateProvider.preferredLanguage('en');
        });
    });

    var ctrl, scope;

    window.beforeEach(inject(function ($controller, $rootScope, $window, $translate, scorerModel, $firebase, $location, $anchorScroll) {
        scope = $rootScope.$new();
        //fb = new MockFirebase(ANY_URLISH_STRING);
        ctrl = $controller('scorerCtrl', {
            $scope: scope,
            $window: $window,
            $translate: $translate,
            scorerModel: scorerModel,
            $firebase: $firebase,
            $location: $location,
            $anchorScroll: $anchorScroll
        });

        scope.data.gameSettings.isUseScoreboard = false;
    }));

    window.it('scope.isMobile should be defined',
        function () {
            expect(scope.isMobile).toBeDefined();
        });

    window.it('collectStats should clear attacks stats arrays',
     function () {
         scope.data.game.stats.attacks.push({ player: { id: "id1", nik: "nik1" }, outcome: "1" });
         scope.data.game.stats.attacks.push({ player: { id: "id1", nik: "nik1" }, outcome: "2" });
         expect(scope.data.game.stats.attacks.length).toEqual(2);

         scope.collectStats();

         expect(scope.data.game.stats.blocks.length).toEqual(1);
     });

    window.it('collectStats should set serving player',
     function () {
         scope.data.game.prevServer = "AlexZ";

         scope.collectStats();

         expect(scope.data.game.stats.servePlayer).toEqual("AlexZ");
     });

    window.it('collectStats should clear stats arrays',
    function () {
        scope.addStatAttack();
        scope.addStatAttack();
        expect(scope.data.game.stats.attacks.length).toEqual(2);

        scope.data.game.stats.blocks.push({ player: { id: "id1", nik: "nik1" }, outcome: "1" });
        scope.data.game.stats.blocks.push({ player: { id: "id1", nik: "nik1" }, outcome: "2" });
        expect(scope.data.game.stats.blocks.length).toEqual(2);

        scope.collectStats();

        expect(scope.data.game.stats.attacks.length).toEqual(1);
        expect(scope.data.game.stats.blocks.length).toEqual(1);
    });

    window.it('historyAdd should add data to history array',
    function () {
        scope.data.game.teamLeft = 'Left';
        scope.data.game.teamRight = 'Right';
        scope.data.game.lastScored = 'Last';
        scope.data.game.nextServer = 'Next';
        scope.data.history = [];

        scope.historyAdd();

        var record = scope.data.history.pop();
        expect(record.teamLeft).toEqual("Left");
        expect(record.teamRight).toEqual("Right");
        expect(record.lastScored).toEqual("Last");
        expect(record.nextToServe).toEqual("Next");
    });

    window.it('assignPoint should increase teamRight.count by 1',
    function () {
        scope.data.game.isSwitched = true;
        scope.data.game.teamRight.count = 0;

        scope.assignPoint('teamRight');

        expect(scope.data.game.teamRight.count).toEqual(1);
        expect(scope.data.game.isSwitched).toEqual(false);
    });

    window.it('assignPoint should increase teamLeft.count by 1',
    function () {
        scope.data.game.isSwitched = true;
        scope.data.game.teamLeft.count = 5;

        scope.assignPoint('teamLeft');

        expect(scope.data.game.teamLeft.count).toEqual(6);
        expect(scope.data.game.isSwitched).toEqual(false);
    });

    window.it('nextServer should stay same if point won on serve',
    function () {
        scope.data.game.lastScored = 'teamLeft';
        scope.data.game.nextServer = 'player1';
        scope.data.game.teamLeft.lastServed = 'player1';
        scope.data.game.teamRight.lastServed = 'player1';

        scope.setNextServer('teamLeft');

        expect(scope.data.game.lastScored).toEqual('teamLeft');
        expect(scope.data.game.nextServer).toEqual('player1');
        expect(scope.data.game.teamLeft.lastServed).toEqual('player1');
        expect(scope.data.game.teamRight.lastServed).toEqual('player1');
    });

    window.it('nextServer should change same if point lost on serve',
    function () {
        scope.data.game.lastScored = 'teamLeft';
        scope.data.game.nextServer = 'player1';
        scope.data.game.teamLeft.lastServed = 'player1';
        scope.data.game.teamRight.lastServed = 'player1';

        scope.setNextServer('teamRight');

        expect(scope.data.game.lastScored).toEqual('teamRight');
        expect(scope.data.game.nextServer).toEqual('player2');
        expect(scope.data.game.teamLeft.lastServed).toEqual('player1');
        expect(scope.data.game.teamRight.lastServed).toEqual('player1');
    });

    window.it('gameEnding should be empty when points equal',
    function () {
        scope.data.game.teamLeft.count = 20;
        scope.data.game.teamRight.count = 20;

        scope.checkNextPoint();

        expect(scope.data.game.gameEnding).toEqual('');
    });

    /*
        window.it('gameEnding should be "Set Point"',
        function () {
            scope.data.gameSettings.numberOfSets = 2;
            scope.data.game.currentPointsToWin = 21;
            scope.data.game.teamLeft.setsWon = 0;
            scope.data.game.teamLeft.count = 20;
            scope.data.game.teamRight.count = 19;
    
            scope.checkNextPoint();
    
            expect(scope.data.game.gameEnding).toEqual('Set Point');
        });
    
        window.it('gameEnding should be "Match Point"',
        function () {
            scope.data.gameSettings.numberOfSets = 2;
            scope.data.game.currentPointsToWin = 21;
            scope.data.game.teamLeft.setsWon = 1;
            scope.data.game.teamLeft.count = 20;
            scope.data.game.teamRight.count = 19;
    
            scope.checkNextPoint();
    
            expect(scope.data.game.gameEnding).toEqual('Match Point');
        });
    
        window.it('gameEnding should be "Team Winners won!"',
        function () {
            scope.data.gameSettings.numberOfSets = 2;
            scope.data.game.currentPointsToWin = 21;
            scope.data.game.teamLeft.name = 'Winners';
            scope.data.game.teamLeft.setsWon = 1;
            scope.data.game.teamLeft.count = 21;
            scope.data.game.teamRight.count = 19;
    
            scope.checkNextPoint();
    
            expect(scope.data.game.gameEnding).toEqual('Team Winners won!');
            expect(scope.data.game.teamLeft.setsWon).toEqual(2);
        });
    
        window.it('getScoreMessage should return "10, 5. Server is AlexZ"',
        function () {
            scope.data.game.lastScored = 'teamLeft';
            scope.data.game.teamLeft.count = 10;
            scope.data.game.teamRight.count = 5;
            scope.data.game.nextServer = 'player2';
            scope.data.game.teamLeft.player2.nik = 'AlexZ';
    
            expect(scope.getScoreMessage()).toEqual('10, 5. Server is AlexZ');
        });
    
        window.it('getScoreMessage should return "5, 10. Server is Oxana"',
        function () {
            scope.data.game.lastScored = 'teamRight';
            scope.data.game.teamLeft.count = 10;
            scope.data.game.teamRight.count = 5;
            scope.data.game.nextServer = 'player1';
            scope.data.game.teamRight.player1.nik = 'Oxana';
    
            expect(scope.getScoreMessage()).toEqual('5, 10. Server is Oxana');
        });
    
    */
    window.it('undo should take previous point',
    function () {
        scope.data.history = [{
            teamLeft: 'Left1',
            teamRight: 'Right1',
            lastScored: 'last1',
            nextToServe: 'next1'
        }, {
            teamLeft: 'Left2',
            teamRight: 'Right2',
            lastScored: 'last2',
            nextToServe: 'next2'
        }];

        scope.undo();

        expect(scope.data.game.teamLeft).toEqual('Left1');
        expect(scope.data.game.teamRight).toEqual('Right1');
        expect(scope.data.game.lastScored).toEqual('last1');
        expect(scope.data.game.nextServer).toEqual('next1');
    });

    window.it('switchEnds should switch teams',
    function () {
        scope.data.gameSettings.isUseScoreboard = false;
        scope.data.game.lastScored = 'teamRight';
        scope.data.game.teamLeft = 'team1';
        scope.data.game.teamRight = 'team2';

        scope.switchEnds();

        expect(scope.data.game.isSwitched).toEqual(true);
        expect(scope.data.game.lastScored).toEqual('teamLeft');
        expect(scope.data.game.teamLeft).toEqual('team2');
        expect(scope.data.game.teamRight).toEqual('team1');
    });

    window.it('startGame should initialize variables for second set',
    function () {
        scope.data.gameSettings.isUseScoreboard = false;
        scope.data.game.isGameStarted = false;
        scope.data.game.teamLeft.setsWon = 1;
        scope.data.game.teamRight.setsWon = 0;
        scope.data.game.currentSet = 0;
        scope.data.game.lastScored = 'teamLeft';
        scope.data.game.nextServer = 'player1';
        scope.data.game.teamLeft.player1 = 'AlexZ';

        scope.startGame();

        expect(scope.data.game.isGameStarted).toEqual(true);
        expect(scope.data.game.gameEnding).toEqual('');
        expect(scope.data.game.teamLeft.count).toEqual(0);
        expect(scope.data.game.teamRight.count).toEqual(0);
        expect(scope.data.history.length).toEqual(0);
        expect(scope.data.game.teamLeft.setsWon).toEqual(1);
        expect(scope.data.game.teamRight.setsWon).toEqual(0);
        expect(scope.data.game.currentSet).toEqual(1);
        expect(scope.data.game.firstServe).toEqual('teamLeft');
        expect(scope.data.game.stats.servePlayer).toEqual('AlexZ');
        expect(scope.data.game.currentPointsToWin).toEqual(21);
        expect(scope.data.game.currentPointsToSwitch).toEqual(7);
    });

    window.it('startGame should initialize variables for deciding set',
    function () {
        scope.data.gameSettings.isUseScoreboard = false;
        scope.data.game.isGameStarted = false;
        scope.data.game.teamLeft.setsWon = 1;
        scope.data.game.teamRight.setsWon = 1;
        scope.data.game.currentSet = 2;
        scope.data.game.lastScored = 'teamLeft';
        scope.data.game.nextServer = 'player1';
        scope.data.game.teamLeft.player1 = 'AlexZ';

        scope.startGame();

        expect(scope.data.game.isGameStarted).toEqual(true);
        expect(scope.data.game.gameEnding).toEqual('');
        expect(scope.data.game.teamLeft.count).toEqual(0);
        expect(scope.data.game.teamRight.count).toEqual(0);
        expect(scope.data.history.length).toEqual(0);
        expect(scope.data.game.teamLeft.setsWon).toEqual(1);
        expect(scope.data.game.teamRight.setsWon).toEqual(1);
        expect(scope.data.game.currentSet).toEqual(3);
        expect(scope.data.game.firstServe).toEqual('teamLeft');
        expect(scope.data.game.stats.servePlayer).toEqual('AlexZ');
        expect(scope.data.game.currentPointsToWin).toEqual(15);
        expect(scope.data.game.currentPointsToSwitch).toEqual(5);
    });

    window.it('startGame should initialize variables for new match',
    function () {
        scope.data.gameSettings.isUseScoreboard = false;
        scope.data.game.isGameStarted = false;
        scope.data.game.teamLeft.setsWon = 2;
        scope.data.game.teamRight.setsWon = 1;
        scope.data.game.currentSet = 3;
        scope.data.game.lastScored = 'teamLeft';
        scope.data.game.nextServer = 'player1';
        scope.data.game.teamLeft.player1 = 'AlexZ';

        scope.startGame();

        expect(scope.data.game.isGameStarted).toEqual(true);
        expect(scope.data.game.gameEnding).toEqual('');
        expect(scope.data.game.teamLeft.count).toEqual(0);
        expect(scope.data.game.teamRight.count).toEqual(0);
        expect(scope.data.history.length).toEqual(0);
        expect(scope.data.game.teamLeft.setsWon).toEqual(0);
        expect(scope.data.game.teamRight.setsWon).toEqual(0);
        expect(scope.data.game.currentSet).toEqual(1);
        expect(scope.data.game.firstServe).toEqual('teamLeft');
        expect(scope.data.game.stats.servePlayer).toEqual('AlexZ');
        expect(scope.data.game.currentPointsToWin).toEqual(21);
        expect(scope.data.game.currentPointsToSwitch).toEqual(7);
    });

    window.it('timeToSwitch should return false when already switched',
    function () {
        scope.data.game.isSwitched = true;

        expect(scope.timeToSwitch()).toEqual(false);
    });

    window.it('timeToSwitch should return false when nobody scored yet',
    function () {
        scope.data.game.isSwitched = true;
        scope.data.game.lastScored = '';
        scope.data.game.currentPointsToSwitch = 7;
        scope.data.game.teamLeft.count = 0;
        scope.data.game.teamRight.count = 0;

        expect(scope.timeToSwitch()).toEqual(false);
    });

    window.it('timeToSwitch should return true when total points is 7',
    function () {
        scope.data.game.isSwitched = false;
        scope.data.game.lastScored = 'team1';
        scope.data.game.currentPointsToSwitch = 7;
        scope.data.game.teamLeft.count = 6;
        scope.data.game.teamRight.count = 1;

        expect(scope.timeToSwitch()).toEqual(true);
    });

    window.it('timeToSwitch should return true when total points is 10 and switch on 5',
    function () {
        scope.data.game.isSwitched = false;
        scope.data.game.lastScored = 'team1';
        scope.data.game.currentPointsToSwitch = 5;
        scope.data.game.teamLeft.count = 7;
        scope.data.game.teamRight.count = 3;

        expect(scope.timeToSwitch()).toEqual(true);
    });

    window.it('isChooseServer should return true when game is not started',
    function () {
        scope.data.game.isGameStarted = false;
        scope.data.game.teamLeft.count = 0;
        scope.data.game.teamRight.count = 0;
        scope.data.game.firstServe = '';
        scope.data.game.lastScored = '';

        expect(scope.isChooseServer('teamLeft')).toEqual(true);
    });

    window.it('isChooseServer should return true when first serve for a team',
    function () {
        scope.data.game.isGameStarted = true;
        scope.data.game.teamLeft.count = 1;
        scope.data.game.teamRight.count = 0;
        scope.data.game.firstServe = 'teamRight';
        scope.data.game.lastScored = 'teamLeft';

        expect(scope.isChooseServer('teamLeft')).toEqual(true);
    });

    window.it('isChooseServer should return false when not first serve for a team',
    function () {
        scope.data.game.isGameStarted = true;
        scope.data.game.teamLeft.count = 2;
        scope.data.game.teamRight.count = 0;
        scope.data.game.firstServe = 'teamRight';
        scope.data.game.lastScored = 'teamLeft';

        expect(scope.isChooseServer('teamLeft')).toEqual(false);
    });

    window.it('finishSet should initialize variables',
    function () {
        scope.data.game.teamLeft.setsWon = 1;
        scope.data.game.teamRight.setsWon = 0;
        scope.data.gameSettings.numberOfSets = 2;

        scope.finishSet();

        expect(scope.data.game.currentSet).toEqual(0);
        expect(scope.data.game.currentPointsToWin).toEqual(0);
        expect(scope.data.game.lastScored).toEqual('teamLeft');
        expect(scope.data.game.nextServer).toEqual('player1');
        expect(scope.data.game.isSwitched).toEqual(true);
        expect(scope.data.game.isGameStarted).toEqual(false);

    });

    window.it('finishSet should make startButtonMessage to "START_NEW_SET"',
    function () {
        scope.data.game.teamLeft.setsWon = 1;
        scope.data.game.teamRight.setsWon = 0;
        scope.data.gameSettings.numberOfSets = 2;

        scope.finishSet();

        expect(scope.data.game.startButtonMessage).toEqual('START_NEW_SET');

    });

    window.it('finishSet should make startButtonMessage to "START_NEW_MATCH"',
    function () {
        scope.data.game.teamLeft.setsWon = 2;
        scope.data.game.teamRight.setsWon = 0;
        scope.data.gameSettings.numberOfSets = 2;

        scope.finishSet();

        expect(scope.data.game.startButtonMessage).toEqual('START_NEW_MATCH');

    });

    window.it('collectServerStat should increment number of serves and wins',
    function () {
        scope.data.game.teamLeft.player1.servedTotal = 2;
        scope.data.game.teamLeft.player1.wonOnServe = 2;
        scope.data.game.lastScored = 'teamLeft';
        scope.data.game.nextServer = 'player1';

        scope.collectServerStat('teamLeft');

        expect(scope.data.game.teamLeft.player1.servedTotal).toEqual(3);
        expect(scope.data.game.teamLeft.player1.wonOnServe).toEqual(3);

    });

    window.it('collectServerStat should increment number of serves but not wins',
    function () {
        scope.data.game.teamLeft.player1.servedTotal = 2;
        scope.data.game.teamLeft.player1.wonOnServe = 2;
        scope.data.game.lastScored = 'teamLeft';
        scope.data.game.nextServer = 'player1';

        scope.collectServerStat('teamRight');

        expect(scope.data.game.teamLeft.player1.servedTotal).toEqual(3);
        expect(scope.data.game.teamLeft.player1.wonOnServe).toEqual(2);

    });


});