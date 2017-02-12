'use strict';

(function() {

  describe("app.module", function () {

    beforeEach(module('app'));

    var $controller, $scope;

    beforeEach(inject(function(_$controller_, _$rootScope_) {
      $scope = _$rootScope_.$new();
      $controller = _$controller_('MainCtrl', {
        $scope: $scope
      });
    }));

    describe("page title", function () {
      it("should be defined", function () {
        expect($scope.pageTitle).toBeDefined();
      });

      it("should be equal to 'HF Yeoman Generator'", function () {
        expect($scope.pageTitle).toEqual('HF Yeoman Generator');
      });
    });

    describe("say yo", function () {
      it("should be defined", function () {
        expect($scope.sayYo).toBeDefined();
      });

      it("should be a function", function () {
        expect(typeof $scope.sayYo).toEqual('function');
      });
    });

  });

})();
