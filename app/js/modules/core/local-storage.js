angular.module("LocalStorage", []).factory("LocalStorageService", [
  "$rootScope", "$q", function($rootScope, $q) {
    var api, failureHandler, valid;

    api = {};
    api.privateBrowsingEnabled = false;
    api.privateBrowsingMsg = "To use " + Product.name + " with this device, switch Private Browsing to the 'OFF' position.";
    if (Teseda.platform.name === "desktop-browser") {
      api.privateBrowsingMsg = "It appears you may have cookies disabled. To use " + Product.name + ", please ensure cookies are enabled in your browser.";
    } else if (Teseda.platform.IS_ANDROID) {
      api.privateBrowsingMsg = "To use " + Product.name + " with this device, please ensure Javascript and Cookies are enabled. Additionally, ensure that your Privacy Settings are set to their default settings.";
    }
    $rootScope.privateBrowsingMsg = api.privateBrowsingMsg;
    valid = function() {
      var err, ls, success, value;

      if (window && window.localStorage) {
        ls = window.localStorage;
        success = true;
        value = Math.random();
        try {
          ls.setItem(value, value);
        } catch (_error) {
          err = _error;
          success = false;
        }
        ls.removeItem(value);
        return success;
      }
      return false;
    };
    failureHandler = function() {
      return $rootScope.changeRoute('/private_browsing');
    };
    api.save = function(key, data) {
      var defer;

      defer = $q.defer();
      if (valid()) {
        store.set(key, data);
        defer.resolve();
      } else {
        failureHandler();
        defer.reject();
      }
      return defer.promise;
    };
    api.get = function(key, property) {
      var defer;

      defer = $q.defer();
      if (valid()) {
        defer.resolve(store.get(key).property);
      } else {
        failureHandler();
        defer.reject();
      }
      return defer.promise;
    };
    api.getAll = function(key) {
      var defer;

      defer = $q.defer();
      if (valid()) {
        defer.resolve(store.get(key));
      } else {
        failureHandler();
        defer.reject();
      }
      return defer.promise;
    };
    api.reset = function(key) {
      var defer;

      defer = $q.defer();
      if (valid()) {
        $rootScope[key] = 'undefined';
        store.remove(key);
        defer.resolve();
      } else {
        failureHandler();
        defer.reject();
      }
      return defer.promise;
    };
    api.create = function(name, defaults) {
      var def, defer;

      defer = $q.defer();
      def = defaults;
      if (!angular.isObject(def)) {
        def = {};
      }
      if (valid()) {
        $rootScope.$watch(name, (function(newData) {
          api.save(name, newData);
          return $rootScope.$broadcast("change:" + name);
        }), true);
        api.getAll(name).then(function(allData) {
          allData = allData || def;
          _.defaults(allData, def);
          $rootScope[name] = allData;
          return defer.resolve(allData);
        });
      } else {
        failureHandler();
        defer.reject();
      }
      return defer.promise;
    };
    return api;
  }
]);
