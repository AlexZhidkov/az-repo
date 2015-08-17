angular.module("setupControllers", ['ngCookies'])
.controller('setupController', ['$scope', '$cookies', '$window', '$translate', 'scorerModel', '$location', '$anchorScroll',
function ($scope, $cookies, $window, $translate, scorerModel, $location, $anchorScroll) {
    $scope.data = scorerModel;
    $scope.isMobile = !$window.matchMedia("(min-width: 992px)").matches;

    if ($scope.isMobile) {
        $location.hash('top');
        $anchorScroll();
    }

    $scope.updateCookie = function (cookie) {
        $cookies[cookie] = $scope.data.gameSettings[cookie];
    }

    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
    };

}]);