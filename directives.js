angular.module('scorerApp')
.directive('myDirective', function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                myUrl: '=someAttr',
                myLinkText: '@'
            },
            template: '\
          <div>\
            <label>My Url Field:</label>\
            <input type="text" ng-model="myUrl" />\
            <a href="{{myUrl}}">{{myLinkText}}</a>\
          </div>\
        '
        };
    })

.directive('bvsSetupTextInput', function () {
        return {
            restrict: 'E',
            compile: function(element, attrs) {
                var label = attrs.bvsLabel;
                var placeholder = attrs.bvsPlaceholder;
                var model = attrs.bvsModel;
                var htmlText =
                    '<div class="form-group">' +
                        '<label for="' + model + '">{{&#39' + label + '&#39 | translate}}:</label>' +
                        '<input type="text" class="form-control" id="' + model + '" placeholder="{{&#39' + placeholder + '&#39 | translate}}" ng-model="data.gameSettings.' + model + '">' +
                        '</div>';
                element.replaceWith(htmlText);
            }
        };
    })

.directive('bvsSetupCheckboxInput', function () {
    return {
        restrict: 'E',
        compile: function (element, attrs) {
            var label = attrs.bvsLabel;
            var model = attrs.bvsModel;
            var htmlText =
                '<div class="form-group">' +
                    '<div class="checkbox">' +
                        '<label>' +
                            '<input type="checkbox" id="' + model + '" ng-model="data.gameSettings.' + model + '" ng-change="updateCookie(&#39' + model + '&#39)"> {{&#39' + label + '&#39 | translate}}' +
                        '</label>' +
                    '</div>' +
                '</div>';

            element.replaceWith(htmlText);
        }
    };
})

.directive('bvsScoringPlayer', function () {
    return {
        restrict: 'A',
        require: 'td',
        compile: function (element, attrs) {
            var team = attrs.bvsTeam;
            var player = attrs.bvsPlayer;
            var htmlText =
            '<td class=" col-xs-6 col-md-2">' +
                '<i class="fa fa-life-ring pull-left"' +
                    'ng-style="{visibility: (data.game.lastScored == &#39team' + team + '&#39 && data.game.nextServer == &#39player' + player + '&#39) && &#39visible&#39 || &#39hidden&#39}"></i>' +
                '<div ng-hide="isChooseServer(&#39team' + team + '&#39)">{{data.game.team' + team + '.player' + player + '.nik}}</div>' +
                '<div ng-show="isChooseServer(&#39team' + team + '&#39)">' +
                    '<a href="" ng-click="data.game.lastScored = &#39team' + team + '&#39&#59 data.game.nextServer = &#39player' + player + '&#39">{{data.game.team' + team + '.player' + player + '.nik}}</a>' +
                '</div>' +
            '</td>';
            element.replaceWith(htmlText);
        }
    };
})

.directive('bvsPlayerInput', function () {
    return {
        restrict: 'E',
        compile: function (element, attrs) {
            var team = attrs.team;
            var player = attrs.player;
            var htmlText = '<div class="input-group">' +
                '<span class="input-group-addon" ng-show="data.team' + team + '.player' + player + '.id"><i class="glyphicon glyphicon-asterisk"></i></span>' +
                '<input type="text" ng-readonly="data.team' + team + '.player' + player + '.id" class="form-control" placeholder="{{&#39ENTER_PLAYER_NAME&#39 | translate}}" name="srch-term" id="srch-term" ng-model="data.team' + team + '.player' + player + '.nik">' +
                '<div class="input-group-btn">' +
                    '<button class="btn btn-default" type="button" ng-click="data.team' + team + '.player' + player + '.id = &#39&#39" ng-show="data.team' + team + '.player' + player + '.id"><i class="glyphicon glyphicon-remove"></i></button>' +
                    '<button class="btn btn-default" type="button" ng-click="team' + team + 'player' + player + 'expanded = !team' + team + 'player' + player + 'expanded">' +
                        '<i ng-class="{true: &#39glyphicon glyphicon-chevron-up&#39 , false: &#39glyphicon glyphicon-chevron-down&#39 }[team' + team + 'player' + player + 'expanded]"></i>' +
                    '</button>' +
                '</div>' +
            '</div>' +
            '<div class="input-group" ng-show="team' + team + 'player' + player + 'expanded">' +
                '<ul class=" list-unstyled" ng-repeat="person in people | filter:data.team' + team + '.player' + player + '.nik">' +
                    '<li>' +
                        '<a href="" ng-click="data.team' + team + '.player' + player + '.nik = person.nik; data.team' + team + '.player' + player + '.id = people.$keyAt($index)">{{ person.nik }} ({{person.name}})</a>' +
                    '</li>' +
                '</ul>' +
            '</div>';
            element.replaceWith(htmlText);
        }
    };
})

.directive('bvsStatsOutcome', function ($compile) {
    return {
        restrict: 'E',
        compile: function (element, attrs) {
            var name = attrs.bvsName;
            var model = attrs.bvsModel;
            var outcomes = attrs.bvsOutcomes;
            var htmlText =
                '<select class="form-control" id="' + name + '" ng-model="' + model + '" name="' + name +
                        '" ng-options="item.value as item.text for item in [' + outcomes + ']">' +
                    '<option value="" translate>OUTCOME</option>' +
                '</select>';

            element.replaceWith(htmlText);
            return function($scope, $element) {
                $compile($element)($scope);
            };
        }
    };
})

.directive('bvsStatsPlayer', function () {
    return {
        replace: true,
        restrict: 'E',
        scope: false,
        template: function (element, attrs) {
            var player = attrs.bvsPlayer;
            return '<select class="form-control" id="' + player + 'Player" ng-model="data.game.stats.' + player + 'Player" name="' + player + 'Player" ng-options="' + player + 'Player.nik for ' + player + 'Player in data.players">' +
                '<option value="">Select player</option>' +
            '</select>';
        }
    };
})

.directive('bvsStatsPlayerOld', function ($compile) {
    return {
        restrict: 'E',
        compile: function (element, attrs) {
            var player = attrs.bvsPlayer;
            var htmlText =
            '<select class="form-control" id="' + player + 'Player" ng-model="data.game.stats.' + player + 'Player" name="' + player + 'Player" ng-options="' + player + 'Player.nik for ' + player + 'Player in data.players">' +
                '<option value="">Select player</option>' +
            '</select>';

            element.replaceWith(htmlText);
            return function($scope, $element) {
                $compile($element)($scope);
            };
        }
    };
})

.directive('bvsTeamInput', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        compile: function (element, attrs) {
            var team = attrs.team;
            var player1 = angular.element('<bvs-player-input team="1" player="1"></bvs-player-input>');
            var player2 = angular.element('<bvs-player-input team="1" player="2"></bvs-player-input>');

            element.removeAttr("bvs-team-input");

            var panel = angular.element("<div>").addClass("panel panel-default");
            var panelHeading = angular.element("<div>").addClass("panel-heading").text("Team 1");
            var panelBody = angular.element("<div>").addClass("panel-body");

            panelBody.append((angular.element("<form>").attr("role", "form").attr("name", "teamsForm").attr("novalidate", ""))
                .append((angular.element("<div>").addClass("input-group"))
                    .append(angular.element("<input>").addClass("form-control")
                        .attr("type", "text")
                        .attr("ng-model", "data.team1.name")
                        .attr("placeholder", "Enter Team1 Name")
                        .attr("id", "team1Name")
                    )
                    .append((angular.element("<div>").addClass("input-group-btn"))
                        .append((angular.element("<button>").addClass("btn btn-default")
                            .attr("type", "button")
                            .attr("ng-click", "makeTeam1Name()"))
                            .append(angular.element("<i>").addClass("glyphicon glyphicon-pencil"))
                        )
                    )
                )
                .append(player1)
                .append(player2)
            );
            panel
                .append(panelHeading)
                .append(panelBody);

            element.replaceWith(panel);
            return function($scope, $element, $attrs, $ctrl) {
                $compile($element)($scope);
            };
        }
    };
})

.directive('bvsTeamInputOld', function ($compile) {
    return {
        restrict: 'E',
        compile: function (element, attrs) {
            var elem = element;
            var team = attrs.team;
            var player1 = angular.element('<bvs-player-input team="1" player="1"></bvs-player-input>');
            var player2 = angular.element('<bvs-player-input team="1" player="2"></bvs-player-input>');
            $compile(player1);
            $compile(player2);

            var htmlText =
                '<div id="top" class="panel panel-default">' +
                    '<div class="panel-heading">Team 1</div>' +
                    '<div class="panel-body">' +
                        '<form role="form" name="teamsForm" novalidate>' +
                            '<div class="input-group">' +
                                '<input type="text" class="form-control" placeholder="Enter Team1 Name" id="team1Name" ng-model="data.team1.name">' +
                                '<div class="input-group-btn">' +
                                    '<button class="btn btn-default" type="button" ng-click="makeTeam1Name()"><i class="glyphicon glyphicon-pencil"></i></button>' +
                                '</div>' +
                            '</div>' +
                            player1 +
                            player2 +
/*
            elem.append(player1);
            elem.append(player2);
*/
                        '</form>' +
                    '</div>' +
                '</div>'
            ;
            element.replaceWith(htmlText);
        }
    };
});
