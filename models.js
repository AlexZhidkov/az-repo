angular.module('scorerApp').service("scorerModel", [function () {
    this.team1 = {
        'name': 'East',
        'count': 0,
        'player1': 'East1',
        'player2': 'East2',
        'lastServed': ''
    };
    this.team2 = {
        'name': 'West',
        'count': 0,
        'player1': 'West1',
        'player2': 'West2',
        'lastServed': ''
    };

    this.switchOnPoints = 7;
    this.history = [];
    this.isSwitched = true;

}]);