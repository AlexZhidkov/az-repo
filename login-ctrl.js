angular.module("loginControllers", ["firebase"])
.controller('loginController', ['$scope', 'scorerModel', '$firebase', '$firebaseSimpleLogin',
function ($scope, scorerModel, $firebase, $firebaseSimpleLogin) {
    $scope.data = scorerModel;
    $scope.appUser = scorerModel.appUser;
    $scope.loginBtnText = "";

    if (!$scope.data.loginObj) {
        var ref = new window.Firebase($scope.data.fireBase.root);
        $scope.loginObj = $firebaseSimpleLogin(ref);

        $scope.loginObj.$getCurrentUser().then(function (user) {
            if (!$scope.loginObj.user) {
                $scope.loginBtnText = "LOG_IN_FACEBOOK";
            } else {
                $scope.loginBtnText = "LOG_OUT";
                $scope.bindUser(user);
            }
        });
    }

    $scope.loginWithFacebook = function () {
        if ($scope.loginObj.user) {
            $scope.loginObj.$logout();
            $scope.sync.$destroy();
            $scope.loginBtnText = "LOG_IN_FACEBOOK"; //"Log In Using Facebook";
            $scope.appUser =
                {
                    id: '',
                    name: '',
                    nik: '',
                };
        } else {
            $scope.loginObj.$login("facebook").then(function (user) {
                console.log("Logged in as: " + user.uid);
                $scope.bindUser(user);
                $scope.loginBtnText = "LOG_OUT";

            }, function (error) {
                console.error("Login failed: " + error);
            });
        }
    };

    $scope.bindUser = function (user) {
        var refUser = new window.Firebase($scope.data.fireBase.root + '/users/' + user.id);
        $scope.sync = $firebase(refUser).$asObject();
        $scope.appUser.id = refUser.name();
        $scope.sync.$bindTo($scope, "appUser").then(function() {
            if (!$scope.appUser.name) {
                $scope.addNewUser();
            }
        });
    };

    $scope.addNewUser = function () {
        var refUsers = new window.Firebase($scope.data.fireBase.root + '/users');
        var sync = $firebase(refUsers);
        sync.$set($scope.loginObj.user.id,
            {
                nik: $scope.loginObj.user.thirdPartyUserData.first_name,
                name: $scope.loginObj.user.displayName
            }
            ).then(function (refP) {
                refP.setPriority($scope.loginObj.user.thirdPartyUserData.first_name);
            }/*, error handler */);
        $scope.appUser = {
            id: $scope.loginObj.user.id,
            name: $scope.loginObj.user.displayName,
            nik: $scope.loginObj.user.thirdPartyUserData.first_name
        };
    };

}]);
