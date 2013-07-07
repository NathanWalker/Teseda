/*
  User Service
*/
angular.module("User.config", []).value("User.config", {});

angular.module("User", ["Logger", "User.config", "StaticText", "Resource"]).run([
  "LogService", "$rootScope", "$location", "StaticTextService", "UserService", "ModalService", "ResourceService", function(log, $rootScope, $location, statictext, userService, modal, rs) {
    $rootScope.isAuthenticated = false;
    $rootScope.userInitialized = false;
    $rootScope.currentUser = {};
    $rootScope.isCurrentUserLocation = function(routeArray) {
      if ($rootScope.currentUser) {
        return _.any(routeArray, function(route) {
          return $location.url() === "/account/" + $rootScope.currentUser.id + route;
        });
      } else {
        return false;
      }
    };
    $rootScope.changeCurrentUserRoute = function(route) {
      return $rootScope.changeRoute("/account/" + $rootScope.currentUser.id + route);
    };
    $rootScope.logout = function() {
      return userService.logout().then(function() {
        return $rootScope.changeRoute('/');
      });
    };
    $rootScope.openSettings = function() {
      return modal.open('views/account/settings.html', 'Account', 'account-settings');
    };
    $rootScope.$watch("isAuthenticated", function(val) {
      return $rootScope.$broadcast((val ? Teseda.scope.events.user.authenticatedYes : Teseda.scope.events.user.authenticatedNo));
    });
    $rootScope.$on(Teseda.scope.events.user.refresh, function(e) {
      return userService.refreshUser();
    });
    return $rootScope.$on(rs.events.ready, function() {
      return $rootScope.$on(rs.events.account.update, function(e, user) {
        _.extend(user, {
          auth_token: $rootScope.currentUser.auth_token
        });
        return userService.cacheLocally(user).then(function() {
          $rootScope.alert(statictext.accountSettings.updated);
          return rs.closeView();
        });
      });
    });
  }
]);
