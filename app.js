var scorerApp = angular.module('scorerApp', ['ngRoute', 'firebase', 'pascalprecht.translate', 'scorerModels', 'scorerControllers', 'loginControllers', 'statsControllers', 'teamsControllers', 'setupControllers', 'scoreboardControllers']);

// configure routes
scorerApp.config(function ($routeProvider, $translateProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/teams.html',
            controller: 'teamsController'
        })
        .when('/setup', {
            templateUrl: 'pages/setup.html',
            controller: 'setupController'
        })
        .when('/pickTeams', {
            templateUrl: 'pages/teams.html',
            controller: 'teamsController'
        })
        .when('/liveScoring', {
            templateUrl: 'pages/scoring.html',
            controller: 'scorerCtrl'
        })
        .when('/scoreboard', {
            templateUrl: 'pages/scoreboard.html',
            controller: 'scoreboardController'
        })
        .when('/stats', {
            templateUrl: 'pages/stats.html',
            controller: 'statsController'
        })
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'loginController'
        })
        .when('/about', {
            templateUrl: 'pages/about.html',
            controller: 'mainController'
        })
        .when('/contact', {
            templateUrl: 'pages/contact.html',
            controller: 'contactController'
        });

    $translateProvider.translations('en', {
        // index.html
        APP_TITLE: 'Beach Volleyball Scorer',
        NAV_SETUP: 'Setup',
        NAV_TEAMS: 'Teams',
        NAV_GAME: 'Game',
        NAV_SCOREBOARD: 'Scoreboard',
        NAV_STATS: 'Stats',
        NAV_LOG_IN: 'Log In',
        NAV_ABOUT: 'About',

        // about.html
        ABOUT_DEV: 'Application is developed by',
        ABOUT_NAME: 'Alexander Zhidkov',
        ABOUT_TEXT: 'If you would like to report bugs, suggest enhancements or provide your feedback please do so on ',
        ABOUT_FACEBOOK_PAGE: 'this Facebook page.',
        ABOUT_VERSION: 'Version',

        // login.html
        LOG_IN: 'Log In',
        WELCOME: 'Welcome',
        PLAYING_NAME: 'Playing Name',
        PLAYING_NAME_PH: 'Enter your short name',
        LOGIN_INFO1: 'When you log in for the first time you become registered user.',
        LOGIN_INFO2: 'You need to register to keep your stats in online database.',
        LOG_IN_FACEBOOK: 'Log In Using Facebook',
        LOG_OUT: "Log Out",

        //scoreboard.html
        VS: 'vs',
        SETTINGS: 'Settings',
        MIRROR_SIDES: 'Reverse sides',
        PRONOUNCE_SCORE: 'Pronounce score',

        //scoring.html
        SETS: 'Sets',
        CHOOSE_NEXT_SERVER: 'Choose next server',
        MATCH_POINT: 'Match Point',
        SET_POINT: 'Set Point',
        TEAM: 'Team',
        WON: 'won',
        UNDO: 'Undo',
        SAY_AGAIN: 'Say Again',
        SWITCH_ENDS: 'Switch Ends',
        START_NEW_SET: 'Start New Set',
        START_NEW_MATCH: 'Start New Match',
        SERVER_IS: 'Server is',
        SELECT_PLAYER: 'Select player',
        OUTCOME: 'Outcome',
        SERVE: 'Serve',
        RECEIVE: 'Receive',
        SET: 'Set',
        ACE: 'Ace',
        ATTACK: 'Attack',
        BLOCK: 'Block',
        IN_PLAY: 'In play',
        MISTAKE: 'Mistake',
        MISS: 'Miss',
        GOOD: 'Good',
        KILL: 'Kill',
        SAVE: 'Save',
        SCORING_SAVE_INFO: 'You do not need to use "Save" button. Stats saved automatically when next point is assigned',

        // setup.html
        GAME_SETTINGS: 'Game settings',
        NUMBER_OF_SETS: 'Number of sets to win',
        NUMBER_OF_SETS_PH: 'Enter number of sets to play',
        POINTS_TO_WIN: 'Points to win',
        POINTS_TO_WIN_PH: 'Enter number of point to win a set',
        POINTS_TO_WIN_DECIDING_SET: 'Points to win deciding set',
        POINTS_TO_WIN_DECIDING_SET_PH: 'Enter how many points win deciding set',
        SWITCH_ON_POINTS: 'Switch on points',
        SWITCH_ON_POINTS_PH: 'Enter how many points to switch ends',
        SWITCH_ON_POINTS_DECIDING_SET: 'Switch on points during deciding set',
        SWITCH_ON_POINTS_DECIDING_SET_PH: 'Enter how many points to switch ends during deciding set',
        SCOREBOARD_ON: 'Scoreboard is in use',
        SPEECH_ON: 'Speak',
        STATS_ON: 'Collect Stats',
        USAGE_INFO_ON: 'Show usage information',

        //stats.html
        POINTS_WON_ON_SERVE: 'Points won on serve',
        CLEAR_LIST: 'Clear list',

        //teams.html
        ENTER_TEAM1_NAME: 'Enter Team 1 Name',
        ENTER_TEAM2_NAME: 'Enter Team 2 Name',
        ENTER_PLAYER_NAME: 'Enter Player Name',
        _AND_: ' & ',
        RESET_SCORE_NEW_GAME: 'Reset score. New game.',
        ENTER_PLAYER_NAMES: 'Enter player names first and use',
        GENERATE_TEAM_NAME: 'button to generate team name.',
        SAVING_STATS: 'Saving stats to database only possible for registered users, marked',
        PICK_PLAYER: 'To pick a player form the list of registered users use',
        FILTER_LIST: "button. Type part of the player's name to filter list.",
        USE_BUTTON: 'Use',
        DONT_SAVE_STATS: "button if you don't want to save this player's stats to the database."
    })
    .translations('ru', {
         // index.html
        APP_TITLE: 'Секретарь пляжного воллейбола',
        NAV_SETUP: 'Настройки',
        NAV_TEAMS: 'Команды',
        NAV_GAME: 'Игра',
        NAV_SCOREBOARD: 'Табло',
        NAV_STATS: 'Статистика',
        NAV_LOG_IN: 'Регистрация',
        NAV_ABOUT: 'О программе',

        // about.html
        ABOUT_DEV: 'Программа разработана ',
        ABOUT_NAME: 'Александром Жидковым',
        ABOUT_TEXT: 'Ваши замечания и предложения по доработке программы прошу размещать ',
        ABOUT_FACEBOOK_PAGE: 'на официальной странице в Фейсбуке.',
        ABOUT_VERSION: 'Версия',

        // login.html
        LOG_IN: 'Вход',
        WELCOME: 'Добро пожаловать',
        PLAYING_NAME: 'Игровое имя',
        PLAYING_NAME_PH: 'Введите Ваше имя',
        LOGIN_INFO1: 'Для сохранения Вашей статистики в базе данных Вам необходимо зарегистрироваться.',
        LOGIN_INFO2: 'Регистрация производится с использованием сети Фейсбук.',
        LOG_IN_FACEBOOK: 'Войти как пользователь Фейсбук',
        LOG_OUT: "Выйти",

        //scoreboard.html
        VS: 'против',
        SETTINGS: 'Настройки',
        MIRROR_SIDES: 'Сменить стороны',
        PRONOUNCE_SCORE: 'Объявлять счет',

        //scoring.html
        SETS: 'Партии',
        MATCH_POINT: 'Матчбол',
        SET_POINT: 'Контрольный мяч',
        CHOOSE_NEXT_SERVER: 'Кто подает?',
        TEAM: 'Команда',
        WON: 'победила',
        UNDO: 'Отменить',
        SAY_AGAIN: 'Повторить',
        SWITCH_ENDS: 'Смена сторон',
        START_NEW_SET: 'Новая партия',
        START_NEW_MATCH: 'Новый матч',
        SERVER_IS: 'На подаче',
        SELECT_PLAYER: 'Выберите игрока',
        OUTCOME: 'Выберите',
        SERVE: 'Подача',
        RECEIVE: 'Прием',
        SET: 'Пас',
        ACE: 'Эйс',
        ATTACK: 'Атака',
        BLOCK: 'Блок',
        IN_PLAY: 'В игре',
        MISTAKE: 'Ошибка',
        MISS: 'Ошибка',
        GOOD: 'Хорошо',
        KILL: 'Kill',
        SAVE: 'Сохранить',
        SCORING_SAVE_INFO: 'Нажимать "Сохранить" не обязательно. Статистика сохраняется автоматически при определении победителя следующего розыгрыша.',

        // setup.html
        GAME_SETTINGS: 'Настройки',
        NUMBER_OF_SETS: 'Число партий',
        NUMBER_OF_SETS_PH: 'Укажите число разыгрываемых партий',
        POINTS_TO_WIN: 'Очков в партии',
        POINTS_TO_WIN_PH: 'Сколько очков выигрывают партию',
        POINTS_TO_WIN_DECIDING_SET: 'Очков в решающей партии',
        POINTS_TO_WIN_DECIDING_SET_PH: 'Сколько очков выигрывают решающую партию',
        SWITCH_ON_POINTS: 'Количество очков для смены сторон',
        SWITCH_ON_POINTS_PH: 'Укажите как часто производится смена сторон',
        SWITCH_ON_POINTS_DECIDING_SET: 'Очков для смены сторон в решающей партии',
        SWITCH_ON_POINTS_DECIDING_SET_PH: 'Укажите как часто производится смена сторон в решающей партии',
        SCOREBOARD_ON: 'Использовать табло',
        SPEECH_ON: 'Произносить счет',
        STATS_ON: 'Собирать статистику',
        USAGE_INFO_ON: 'Показывать подсказки',

        //stats.html
        POINTS_WON_ON_SERVE: 'Очков выиграно на подаче',
        CLEAR_LIST: 'Убрать',

        //teams.html
        ENTER_TEAM1_NAME: 'Название первой команды',
        ENTER_TEAM2_NAME: 'Название второй команды',
        ENTER_PLAYER_NAME: 'Укажите имя игрока',
        _AND_: ' и ',
        RESET_SCORE_NEW_GAME: 'Обнулить счет и начать новую игру',
        ENTER_PLAYER_NAMES: 'Сначала введите имена игроков команды а затем нажмите ',
        GENERATE_TEAM_NAME: ' чтобы сгенерировать название команды автоматически.',
        SAVING_STATS: 'Сохранение статистики в базе данных возможно только для зарегистрированных пользователей, помеченных знаком ',
        PICK_PLAYER: 'Чтобы выбрать игрока из списка зарегистрированных пользователей нажмите',
        FILTER_LIST: ". Начните набирать имя игрока чтобы отфильтровать список.",
        USE_BUTTON: 'Нажмите',
        DONT_SAVE_STATS: "если Вы не хотите сохранять статистику этого игрока в базе данных."
    })

    .translations('de', {
        HEADLINE: 'Hey, das ist meine großartige App!',
        INTRO_TEXT: 'Und sie untersützt mehrere Sprachen!'
    });

    $translateProvider.determinePreferredLanguage();
    var language = $translateProvider.preferredLanguage();
    switch (language.substring(0, 2)) {
    case 'ru':
        $translateProvider.preferredLanguage('ru-ru');
        
    default:
        $translateProvider.preferredLanguage('en');
}

});

scorerApp.controller('mainController', ['$scope', '$window', 'scorerModel', '$location', '$anchorScroll',
function ($scope, $window, scorerModel, $location, $anchorScroll) {
    $scope.data = scorerModel;
    $scope.isMobile = !$window.matchMedia("(min-width: 992px)").matches;

    if ($scope.isMobile) {
        $location.hash('top');
        $anchorScroll();
    }

}]);

