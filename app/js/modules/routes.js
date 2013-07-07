angular.module("AppRoutes", ["Logger"]).config([
  "$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
    var nope, routingPrefix;

    routingPrefix = CONFIG.routing.prefix;
    if (CONFIG.routing.html5Mode) {
      $locationProvider.html5Mode(true);
    }
    if (routingPrefix && routingPrefix.length > 0) {
      $locationProvider.hashPrefix(routingPrefix);
    }
    nope = function() {
      return false;
    };
    /*
    CORE ROUTES
    */

    _.forEach(Object.keys(ROUTER.routes), function(key) {
      var params, route, templateKey;

      route = ROUTER.routes[key];
      params = {
        controller: route.ctrl
      };
      templateKey = route.view.indexOf('<') === 0 ? 'template' : 'templateUrl';
      params[templateKey] = templateKey === 'template' ? route.view : CONFIG.prepareViewUrl(route.view);
      if (route.resolve) {
        params.resolve = route.resolve;
      }
      return ROUTER.when(key, route.url, params);
    });
    ROUTER.otherwise({
      redirectTo: "/_404"
    });
    return ROUTER.install($routeProvider);
  }
]);
