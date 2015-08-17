angular.module("translations", ["pascalprecht.translate"])
  .provider("$translate", function () {

  })
.config(function ($translateProvider) {

        $translateProvider.translations('en', function() {
            return {
                HEADLINE: 'Hello there, This is my awesome app!',
                INTRO_TEXT: 'And it has i18n support!'
            }
        });
        $translateProvider.translations('de', function() {
            return {
                HEADLINE: 'Hey, das ist meine großartige App!',
                INTRO_TEXT: 'Und sie untersützt mehrere Sprachen!'
            }
        });
    })
//$translateProvider.determinePreferredLanguage()
//$translateProvider.preferredLanguage('en');

/*
angular.module('translations', ['pascalprecht.translate'])
  .config(function ($translateProvider) {
      $translateProvider.translations('en', {
          HEADLINE: 'Hello there, This is my awesome app!',
          INTRO_TEXT: 'And it has i18n support!'
      })
      .translations('de', {
          HEADLINE: 'Hey, das ist meine großartige App!',
          INTRO_TEXT: 'Und sie untersützt mehrere Sprachen!'
      });
      //$translateProvider.determinePreferredLanguage()
      $translateProvider.preferredLanguage('en');
  });
*/
