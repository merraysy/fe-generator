'use strict';

(function() {

  /*=============================================>>>>>
  = WelcomeCtrl =
  ===============================================>>>>>*/
  var WelcomeCtrl = ['$scope', function($scope) {

    /**
     *
     * Local variables
     *
     */
    var data = {
      genList: [
        'folder structure',
        'gulpfile.js',
        'bower.json',
        'karma.conf.js'
      ],
      libList: [
        'normalize',
        'bourbon',
        'neat',
        'angularjs'
      ]
    };

    /**
     *
     * Reveal to $scope
     *
     */
    $scope.data = data;

  }]; // end-WelcomeCtrl

  /**
   *
   * Declaring WelcomeCtrl
   *
   */
  angular.module('welcome').controller('WelcomeCtrl', WelcomeCtrl);

})();
