describe("Testing CORE Routes", function() {

  var test, routes, routeKeys, routeForKey, routeUrl, isController;

  routes = {
    'home_path':{
      ctrl:'HomeCtrl',
      url:'/'
    },
    'login_path':{
      ctrl:'LoginCtrl',
      url:'/login'
    },
    'logout_path':{
      ctrl:'LoginCtrl',
      url:'/logout'
    },
    'private_browsing_path':{
      ctrl:'HomeCtrl',
      url:'/private_browsing'
    },
    '404_path':{
      ctrl:'HomeCtrl',
      url:'/_404'
    },
    '500_path':{
      ctrl:'HomeCtrl',
      url:'/_500'
    },
    'new_path':{
      ctrl:'NewCtrl',
      url:'/new'
    },
    'edit_path':{
      ctrl:'EditCtrl',
      url:'/edit'
    },
    'requests_path':{
      ctrl:'RequestsCtrl',
      url:'/requests'
    },
    'wraps_path':{
      ctrl:'WrapsCtrl',
      url:'/wraps'
    },
    'wraps_filter_path':{
      ctrl:'WrapsCtrl',
      url:'/wraps/:f'
    }
  };
  routeKeys = Object.keys(routes);

  routeForKey = function(key){
    return ROUTER.getRoute(key);
  };
  routeUrl = function(key){
    return ROUTER.routePath(key);
  };
  isController = function(key, name){
    return routeForKey(key).params.controller.should.equal(name);
  };


  before(function(done) {
    ngMidwayTester.register('App', function(instance) {
      test = instance;
      done();
    });
  });

  it("testing route keys should match actual route keys", function() {
    expect(routeKeys.sort()).to.eql(Object.keys(ROUTER.routes).sort());
  });
  /**
   * This tests all the routes :)
   */
  _.forEach(routeKeys, function(key){
    it("should have a " + key, function() {
      var route = routes[key];
      isController(key, route.ctrl);
      expect(routeUrl(key)).to.equal(route.url);
    });
  });

});