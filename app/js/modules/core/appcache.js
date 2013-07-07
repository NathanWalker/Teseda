/*
  ApplicationCache Service
*/
angular.module("AppCache.config", []).value("AppCache.config", {});

angular.module("AppCache", ["Logger", "AppCache.config", "StaticText"]).factory("AppCacheService", [
  "AppCache.config", "LogService", "$window", "$rootScope", "StaticTextService", function(config, log, $window, $rootScope, statictext) {
    var api, events, logId;

    logId = "AppCache";
    events = ['updateReady', 'error'];
    api = {};
    api.enabled = config.enabled;
    api.disablePromptOnUpdate = config.disablePromptOnUpdate;
    api.events = {};
    _.forEach(api.events, function(event) {
      return api.events[event] = "appcache:" + event;
    });
    api.togglePromptOnUpdate = function(toggle) {
      return api.disablePromptOnUpdate = toggle;
    };
    api.init = function() {
      var appCache;

      appCache = angular.element($window.applicationCache);
      appCache.bind("updateready", function(e) {
        var ac;

        ac = $window.applicationCache;
        if (ac.status === ac.UPDATEREADY) {
          ac.swapCache();
          $rootScope.$broadcast(api.events.updateReady);
          $rootScope.safeApply();
          if (api.disablePromptOnUpdate) {
            log("UPDATEREADY - calling window.applicationCache.swapCache()", logId);
            return log("An application update is available. Refresh the page to update now.", logId);
          } else {
            if ($rootScope.confirm(statictext.appCache.updateReady)) {
              return $window.location.reload();
            }
          }
        }
      });
      appCache.bind("error", function(e) {
        log("ERROR - Likely a file got renamed or moved.", logId);
        $rootScope.$broadcast(api.events.error);
        return $rootScope.safeApply();
      });
      return appCache.bind("obsolete", function(e) {
        log("OBSOLETE - calling window.applicationCache.update()", logId);
        return $window.applicationCache.update();
      });
    };
    return api;
  }
]).run([
  "AppCache.config", "AppCacheService", "LogService", function(config, appCache, log) {
    return appCache.init();
  }
]);
