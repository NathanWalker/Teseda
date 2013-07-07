/*
  UX Tracking Service
*/
angular.module("UXTracking.config", []).value("UXTracking.config", {});

angular.module("UXTracking", ["Logger", "UXTracking.config"]).factory("UXTrackingService", [
  "LogService", "UXTracking.config", function(log, config) {
    var api;

    api = {};
    api.enabled = config.enabled;
    api.categories = {
      NAVIGATION: 'Navigation',
      USER: "Users",
      PROVIDER: "Third Party Providers"
    };
    api.events = {
      LOGGED_IN: 'Logged in',
      LOGGED_OUT: 'Logged out',
      LOGGED_IN_USING_PROVIDER: 'Logged in with provider',
      ACCOUNT_CONNECTED_NETWORK_PROVIDER: 'Account connected to a provider',
      ACCOUNT_CREATED: 'Account created',
      ACCOUNT_CREATED_USING_PROVIDER: 'Account created using a provider',
      NAVIGATION_HOME: 'Home',
      NAVIGATION_PRODUCTS: 'Products'
    };
    api.track = function(event, data) {
      if (api.enabled && !_.isNothing(analytics)) {
        return analytics.track(event, data);
      }
    };
    api.identify = function(id, data) {
      if (api.enabled && !_.isNothing(analytics)) {
        return analytics.identify(id.toString(), data);
      }
    };
    api.pageview = function(url) {
      if (api.enabled && !_.isNothing(analytics)) {
        return analytics.pageview(url);
      }
    };
    return api;
  }
]);
