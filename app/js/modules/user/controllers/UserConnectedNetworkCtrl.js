angular.module("User").controller("UserConnectedNetworksCtrl", [
  "LogService", "$scope", "$rootScope", "$timeout", "StaticTextService", "OAuthService", function(log, s, $rootScope, $timeout, statictext, oauth) {
    var logId, providerCount, toggling;

    logId = "UserConnectedNetworksCtrl";
    toggling = false;
    s.toggleProvider = function(provider) {
      log(provider);
      if (!toggling) {
        toggling = true;
        if (provider.checked) {
          oauth.deauthorize(provider.id).then(function(data) {
            if (data.errors) {
              return false;
            }
            providerCount--;
            provider.checked = provider.checkedBound = false;
            if (providerCount === 0) {
              return $rootScope.alert(statictext.accountSettings.thirdPartyNotice);
            }
          });
        } else {
          $rootScope.$broadcast(Teseda.scope.events.site.showLoading);
          oauth.authorize(provider, $rootScope.currentUser.auth_token);
        }
        return $timeout(function() {
          return toggling = false;
        }, 500);
      }
    };
    providerCount = 0;
    s.providers = [];
    oauth.getAuthorizedList().then(function(data) {
      var currentProviders;

      currentProviders = {};
      _.forEach(data.authorizations, function(auth) {
        currentProviders[auth.provider] = {
          id: auth.id,
          checked: true,
          checkedBound: true
        };
        return providerCount++;
      });
      return _.forEach(oauth.providers(), function(provider, key) {
        return s.providers.push(_.extend({
          name: key + '-1'
        }, provider, currentProviders[key]));
      });
    });
    return log('init()', logId);
  }
]);
