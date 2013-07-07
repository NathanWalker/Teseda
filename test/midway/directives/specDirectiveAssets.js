//
// test/midway/directives/directivesSpec.js
//
describe("Midway: Testing Asset Directives:", function() {

  var test, $injector, html, project;

  before(function(done) {
    ngMidwayTester.register('App', function(instance) {
      test = instance;
      done();
    });
  });

  before(function() {
    $injector = test.$injector;

    html = '<div data-bb-asset="asset" data-parent-type="project" data-parent="project"></div>';
    project = {
      "id": 1,
      "identifier": "nrw",
      "name": "Nathan Walker",
      "cover":"http://1.bp.blogspot.com/_zCjCbgoA7ww/TOLmuVUpmiI/AAAAAAAAAWA/XGUVbc-l9IU/s1600/zebra-pattern-wallpaper.gif",
      "avatar":"http://www.gravatar.com/avatar/9f6fde47d60d9e383ac1c492c4059358.png"
    };
  });

  it("Asset: gallery", function(done) {

    var $scope = test.scope();
    $scope.asset = {
      "id":1,
      "type": "gallery",
      "layout": "cover",
      "name":"Zebra Pants",
      "created_at":"2013-03-14T17:46:49Z",
      "cover":"http://cdn2.bigcommerce.com/server1300/5038e/products/4485/images/8501/Zebra_Pants__80398.1338918168.800.800.jpg",
      "slides":[
        {"id":1, "image_url":"http://images.nationalgeographic.com/wpf/media-live/photos/000/007/cache/zebra_764_600x450.jpg"},
        {"id":2, "image_url":"http://alumnus.caltech.edu/~kantner/zebras/pictures/zebra_b.jpg"}
      ]
    };
    $scope.project = project;

    var element = angular.element(html);

      test.directive(element, $scope, function(element) {
        setTimeout(function() {
          expect(element.html()).to.match(/Zebra Pants/i);
          expect(element.find('.photos .photo').length).to.equal(2);
          done();
        },1000);
      });
  });

  it("Asset: address", function(done) {

    var $scope = test.scope();
    $scope.asset = {
      "id":1,
      "type": "address",
      "street": "275 Skyline Pkwy",
      "city": "Athens",
      "state": "GA",
      "zip": "30606"
    };
    $scope.project = project;

    var element = angular.element(html);

    test.directive(element, $scope, function(element) {
      setTimeout(function() {
        expect(element.html()).to.match(/data-on="mapsReady"/i);
        expect(element.html()).to.match(/275 Skyline Pkwy/i);
        expect(element.html()).to.match(/data-ng-switch/i);
        done();
      },1000);
    });
  });

});
