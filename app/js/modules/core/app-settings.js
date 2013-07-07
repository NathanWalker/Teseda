/*
  Application Settings Service
  stores settings in localStorage
*/
angular.module("AppSettings.config", []).value("AppSettings.config", {});

angular.module("AppSettings", ["AppSettings.config", "Logger", "LocalStorage"]).factory("AppSettingsService", [
  "$q", "LogService", "AppSettings.config", "$rootScope", "LocalStorageService", function($q, log, config, $rootScope, localStorageService) {
    var api, logId;

    logId = "AppSettings";
    api = {};
    api.init = function() {
      log('init()', logId);
      return localStorageService.create("AppSettings", config.defaultSettings).then(function(settings) {
        var lastUpdatedVersion;

        lastUpdatedVersion = settings.version;
        lastUpdatedVersion.isLessThan = function(target) {
          var i, len;

          i = void 0;
          len = void 0;
          if (!angular.isArray(target)) {
            target = Teseda.util.parseVersion(target);
          }
          if (!angular.isArray(target)) {
            return false;
          }
          i = 0;
          len = target.length;
          while (i < len) {
            if (this[i] < target[i]) {
              return true;
            } else {
              if (this[i] > target[i]) {
                return false;
              }
            }
            i += 1;
          }
          return false;
        };
        if (lastUpdatedVersion.isLessThan(Teseda.prop.version)) {
          return $rootScope.AppSettings.version = Teseda.prop.version;
        }
      });
    };
    return api;
  }
]);
