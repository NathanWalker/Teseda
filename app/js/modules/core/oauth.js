/*
  OAuth
  3rd party services
*/
angular.module("OAuth.config", []).value("OAuth.config", {});

angular.module("OAuth", ["OAuth.config", "Logger"]).factory("OAuthService", [
  "OAuth.config", "LogService", "$rootScope", "$location", "$window", "ResourceService", function(config, log, $rootScope, $location, $window, rs) {
    var api, resourceOptions;

    resourceOptions = {
      type: 'authorizations'
    };
    api = {};
    api.providers = function() {
      return config.providers;
    };
    api.getAuthorizedList = function() {
      return rs.get(resourceOptions);
    };
    api.authorize = function(provider, authToken) {
      return $window.location.href = Teseda.uri.apiServerHost + provider.url + '?token=' + authToken + '&url=' + $location.url();
    };
    api.deauthorize = function(id) {
      var deleteOptions;

      deleteOptions = _.clone(resourceOptions);
      deleteOptions.id = id;
      return rs["delete"](deleteOptions);
    };
    return api;
  }
]);
