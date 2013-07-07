//
// test/midway/directives/directivesSpec.js
//
describe("Midway: Testing Directives:", function() {

  var test, $injector, $rootScope, html;

  before(function(done) {
    ngMidwayTester.register('App', function(instance) {
      test = instance;
      done();
    });
  });

  before(function() {
    $injector = test.$injector;
    $rootScope = $injector.get('$rootScope');
  });

  it("bbTimestamp", function(done) {
    html = '<div data-bb-timestamp="tt"></div>';

    var $scope = test.scope();
    $scope.tt = '2013-03-14T17:46:49Z';
    $rootScope.AppSettings.timestampDisplay = 'full';
    BizBuilt.util.safeApply($rootScope);

    var element = angular.element(html);

    test.directive(element, $scope, function(element) {
      setTimeout(function() {
        expect(element.text()).to.match(/Thursday, Mar 14, 2013 @ 10:46 AM/i);
        done();
      },1000);
    });
  });

});
