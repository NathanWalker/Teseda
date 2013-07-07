angular.module("User").controller("UserCreatorCtrl", [
  "LogService", "$scope", "$rootScope", "UserService", "StaticTextService", "OAuthService", function(log, s, $rootScope, userService, statictext, oauth) {
    var logId;

    logId = "UserCreatorCtrl";
    s.userInputAccount = {
      login: '',
      password: ''
    };
    s.providers = oauth.providers();
    s.cancel = function() {
      return userService.removeView();
    };
    s.save = function() {
      return userService.createUser(s.userInputAccount).then(function() {
        return $rootScope.changeRoute('/');
      });
    };
    s.saveWithBookmark = function() {
      $rootScope.persistLoading = true;
      return userService.createUserFromBookmark(s.userInputAccount);
    };
    s.providerSave = function(provider) {
      $rootScope.$broadcast(Teseda.scope.events.site.updateLoadingMsg, statictext.wraps.createWithProvider(provider.label));
      $rootScope.$broadcast(Teseda.scope.events.site.showLoading, true);
      s.$on(Teseda.scope.events.project.providerSaveReady, function() {
        return $rootScope.refreshPageWithRoute(Teseda.uri.apiServerHost + provider.url + '?url=/new?provider=true');
      });
      return $rootScope.$broadcast(Teseda.scope.events.project.providerSave, {
        label: provider.label
      });
    };
    return log("init()", logId);
  }
]);
