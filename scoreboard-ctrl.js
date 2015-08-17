angular.module("scoreboardControllers", ["firebase"])
.controller('scoreboardController', ['$scope', '$firebase', '$window', '$translate', 
function ($scope, $firebase, $window, $translate) {
    $scope.gameScore = {message: ''};

    $scope.gamesExpanded = true;
    $scope.isSidesMirrored = false;
    $scope.isSpeak = true;

    var ref = new Firebase($scope.data.fireBase.root + '/score');
    $scope.scores = $firebase(ref).$asArray();

    $scope.scores.$loaded().then(function () {
        var timeNow = new Date();
        var len = $scope.scores.length;
        while (len--) {
            if (new Date(timeNow - $scope.scores[len].time) > 18000000) {
                var oldRecord = new Firebase($scope.data.fireBase.root + '/score/' + $scope.scores[len].$id);
                oldRecord.remove();
            }
        }
    });

    $scope.connectToGame = function(key) {
        var refGame = new Firebase($scope.data.fireBase.root + '/score/' + key);
        $scope.gameScore = $firebase(refGame).$asObject();
    };

    $scope.sayMessage = function() {
        if ($scope.gameScore.message !== "") {
            var msg = new window.SpeechSynthesisUtterance($scope.gameScore.message);
            msg.lang = $translate.preferredLanguage();

            window.speechSynthesis.speak(msg);
        }
    };

    $scope.$watch('gameScore.message', function (newValue, oldValue) {
        $scope.sayMessage();
    });

}]);
