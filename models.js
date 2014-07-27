angular.module('scorerApp').service("scorerModel", [function () {
    this.team1 = {
        'name': 'East',
        'setsWon': 0,
        'count': 0,
        'player1': 'East1',
        'player2': 'East2',
        'lastServed': ''
    };
    this.team2 = {
        'name': 'West',
        'setsWon': 0,
        'count': 0,
        'player1': 'West1',
        'player2': 'West2',
        'lastServed': ''
    };

    this.game = {
        'numberOfSets': 3,
        'pointsToWin': 21,
        'pointsToWinLastSet': 15,
        'switchOnPoints': 7
    };

    this.history = [];

}]);