/*
  RestApi
  simple wrapper for $http
*/
angular.module("RestApi.config", []).value("RestApi.config", {});

angular.module("RestApi", ["RestApi.config"]).factory("RestApiService", [
  "RestApi.config", "$http", function(config, $http) {
    /* PRIVATE
    */

    var api, http;

    http = function(method, info) {
      var customConfig, data, paramKeys, server, suffix, url, urlArray;

      server = info.server || config.server;
      suffix = info.suffix || config.suffix;
      customConfig = info.config;
      urlArray = info.url;
      data = info.data;
      url = server.slice(0, -1);
      _.forEach(urlArray, function(section) {
        if (!_.isNothing(section)) {
          return url += "/" + section;
        }
      });
      url += suffix;
      if (info.params) {
        paramKeys = _.keys(info.params);
        if (paramKeys.length) {
          url += '?';
          _.forEach(paramKeys, function(key) {
            return url += "" + key + "=" + info.params[key] + "&";
          });
          url = url.slice(0, url.length - 1);
        }
      }
      switch (method) {
        case 'get':
          return $http.get(url, customConfig);
        case 'save':
          return $http.post(url, data, customConfig);
        case 'update':
          return $http.put(url, data, customConfig);
        case 'delete':
          return $http["delete"](url, customConfig);
      }
    };
    /* PUBLIC
    */

    api = {};
    api.get = function(info) {
      return http('get', info);
    };
    api.save = function(info) {
      return http('save', info);
    };
    api.update = function(info) {
      return http('update', info);
    };
    api["delete"] = function(info) {
      return http('delete', info);
    };
    return api;
  }
]);
