'use strict';

(function() {

  /*=============================================>>>>>
  = MainCtrl =
  ===============================================>>>>>*/
  var MainCtrl = ['$scope', '$state', function($scope, $state) {

    /**
     *
     * Local variables
     *
     */
    var pageTitle = 'HF Yeoman Generator';

    /**
     *
     * @desc: It prints Yo!! on the console
     * @arg: none
     * @return: none
     *
     */
    var sayYo = function() {
      console.log('Yo!!');
    }; // end-test

    /**
     *
     * Reveal to $scope
     *
     */
    $scope.pageTitle = pageTitle;
    $scope.sayYo = sayYo;

    /**
     *
     * Init Function
     *
     */
    var init = function() {
      $scope.sayYo();
      $state.go('welcome');
    }; // end-init

    /**
     *
     * Init
     *
     */
    init();

  }]; // end-MainCtrl

  /*=============================================>>>>>
  = config =
  ===============================================>>>>>*/
  var config = ['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {

    // States
    $stateProvider
      .state('welcome', {
        url: '/welcome',
        controller: 'WelcomeCtrl',
        templateUrl: '/components/welcome/welcome.view.html'
      });

    // HTML5 mode
    $locationProvider.html5Mode(true);

  }]; // end-config

  /*=============================================>>>>>
  = app =
  ===============================================>>>>>*/
  angular.module('app', [
    'ui.router',

    // App modules
    'welcome'
  ])

  /**
   *
   * Declaring MainCtrl
   *
   */
  .controller('MainCtrl', MainCtrl)

  /**
   *
   * Declaring config
   *
   */
  .config(config);

})();
