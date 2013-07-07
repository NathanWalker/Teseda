AppControllers.controller("LoginModalCtrl", [
  "LogService", "$scope", "$rootScope", "$location", "$http", "UserService", function(log, s, $rootScope, $location, $http, userService) {
    var logId;

    logId = "LoginModalCtrl";
    return s.login = function(userInputAccount) {
      log('it ran');
      if (userInputAccount && userInputAccount.login && userInputAccount.password) {
        if (Teseda.prop.clientOnline) {
          return $http.post(Teseda.uri.apiServer + "login.json", {}, {
            headers: {
              Authorization: "Basic " + Base64.encode(userInputAccount.login + ":" + userInputAccount.password)
            }
          }).success(function(data) {
            log((Teseda.uri.apiServer + "login.json") + " --- success result ---", logId);
            log(data.account);
            $rootScope.RequireRemoteAuthentication = false;
            $rootScope.AppSettings.recentUsername = userInputAccount.login;
            return userService.cacheLocally(data.account, userService.loginSuccess);
          }).error(function(data, status, headers, config) {
            if (status === 404 || status === 0) {
              if (Teseda.prop.debug) {
                return $rootScope.alert("Ensure you have the api running! Usually just means you need to run: rails s (in the api app).");
              } else {
                return $rootScope.alert("A connection error occurred, please try again later.");
              }
            }
          });
        }
      } else {
        return userService.loginFailure();
      }
    };
  }
]);
