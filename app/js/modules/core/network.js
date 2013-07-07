/*
  Network Service
  helps with client connectivity issues
*/
angular.module("Network.config", []).value("Network.config", {});

angular.module("Network", ["Logger", "Network.config", "StaticText"]).factory("NetworkService", [
  "Network.config", "LogService", "$window", "$rootScope", function(config, log, $window, $rootScope) {
    var api, events, logId;

    logId = "NetworkService";
    events = ['clientOnline'];
    api = {};
    api.clientOnline = $window.navigator.onLine;
    api.events = {};
    _.forEach(events, function(event) {
      return api.events[event] = "network:" + event;
    });
    api.status = function() {
      log("Client is " + (api.clientOnline ? "online." : "offline."), logId);
      return api.clientOnline;
    };
    api.init = function() {
      var w;

      w = angular.element($window);
      w.bind("online", function() {
        api.clientOnline = true;
        $rootScope.$broadcast(api.events.clientOnline, api.clientOnline);
        $rootScope.safeApply();
        return api.status();
      });
      w.bind("offline", function() {
        api.clientOnline = false;
        $rootScope.$broadcast(api.events.clientOnline, api.clientOnline);
        $rootScope.safeApply();
        return api.status();
      });
      return api.status();
    };
    return api;
  }
]).run([
  "Network.config", "NetworkService", "LogService", "$rootScope", "StaticTextService", function(config, network, log, $rootScope, statictext) {
    network.init();
    return $rootScope.offlineMsg = function() {
      return $rootScope.alert(statictext.offlineMsg);
    };
  }
]);
