/*
ROUTER helper class
*/

var RESOLVE, ROUTER;

ROUTER = void 0;

RESOLVE = void 0;

(function() {
  var lookup, nada, otherwiseLookup;

  lookup = {};
  otherwiseLookup = null;
  nada = function() {
    return false;
  };
  return ROUTER = {
    routes: {
      home_path: {
        ctrl: 'HomeCtrl',
        url: '/',
        view: 'site/start'
      },
      login_path: {
        ctrl: 'LoginCtrl',
        url: '/login',
        view: 'site/login'
      },
      private_browsing_path: {
        ctrl: 'HomeCtrl',
        url: '/private_browsing',
        view: 'site/private-browsing-notice'
      },
      products_path: {
        ctrl: 'ProductsCtrl',
        url: '/products',
        view: 'site/products'
      },
      about_path: {
        ctrl: 'HomeCtrl',
        url: '/about',
        view: 'site/about'
      },
      contact_path: {
        ctrl: 'ContactCtrl',
        url: '/contact',
        view: 'site/contact'
      },
      privacy_path: {
        ctrl: 'HomeCtrl',
        url: '/privacy',
        view: 'site/privacy'
      },
      '404_path': {
        ctrl: 'HomeCtrl',
        url: '/_404',
        view: 'site/404'
      },
      '500_path': {
        ctrl: 'HomeCtrl',
        url: '/_500',
        view: 'site/500'
      }
    },
    when: function(key, url, params) {
      return lookup[key] = {
        url: url,
        params: params
      };
    },
    alias: function(key1, key2) {
      return lookup[key1] = lookup[key2];
    },
    otherwise: function(params) {
      return otherwiseLookup = params;
    },
    replaceUrlParams: function(url, params) {
      var k, v;

      for (k in params) {
        v = params[k];
        url = url.replace(":" + k, v);
      }
      return url;
    },
    routeDefined: function(key) {
      return !!this.getRoute(key);
    },
    getRoute: function(key, args) {
      return lookup[key];
    },
    routePath: function(key, args) {
      var url;

      url = this.getRoute(key);
      url = (url ? url.url : null);
      if (url && args) {
        url = this.replaceUrlParams(url, args);
      }
      return url;
    },
    install: function($routeProvider) {
      var key, params, route, url;

      for (key in lookup) {
        route = lookup[key];
        url = route["url"];
        params = route["params"];
        $routeProvider.when(url, params);
      }
      if (otherwiseLookup) {
        return $routeProvider.otherwise(otherwiseLookup);
      }
    }
  };
})();
