// script.js

// create the module and name it scorerApp
// also include ngRoute for all our routing needs
var scorerApp = angular.module('scorerApp', ['ngRoute']);

// configure our routes
scorerApp.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'mainController'
        })

        // route for the about page
        .when('/live', {
            templateUrl: 'pages/scoring.html',
            controller: 'aboutController'
        })

        // route for the about page
        .when('/about', {
            templateUrl: 'pages/about.html',
            controller: 'aboutController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl: 'pages/contact.html',
            controller: 'contactController'
        });
});

// create the controller and inject Angular's $scope
scorerApp.controller('mainController', function ($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});

scorerApp.controller('aboutController', function ($scope) {
    $scope.message = 'Look! I am an about page.';
});

scorerApp.controller('contactController', function ($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});
