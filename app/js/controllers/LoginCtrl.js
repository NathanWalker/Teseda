AppControllers.controller("LoginCtrl", [
  "LogService", "$scope", "$rootScope", "$q", "$location", "$http", "$routeParams", "UserService", "LocalStorageService", "OAuthService", "ModalService", function(log, s, $rootScope, $q, $location, $http, $routeParams, userService, localStorageService, oauth, modal) {
    var initView, logId;

    logId = "LoginCtrl";
    s.providerLogin = function(provider) {
      var token, url;

      token = ($rootScope.currentUser || {}).auth_token;
      if (provider.label === "Email") {
        return s.toggleTesedaLogin(true);
      } else {
        url = Teseda.uri.apiServerHost + provider.url + "?url=/";
        if (token) {
          url += "&token=" + token;
        }
        return $rootScope.refreshPageWithRoute(url);
      }
    };
    s.showLoginModal = function() {
      return modal.open('views/site/login-modal.html', 'Login using your email');
    };
    initView = function(authenticated) {
      var deferred, provider, url;

      modal.close();
      s.$emit(Teseda.scope.events.site.rootViewReady);
      url = $routeParams.url;
      provider = (oauth.providers()[$routeParams.provider] || {}).label || "third party";
      if (localStorageService.privateBrowsingEnabled) {
        return $rootScope.changeRoute("/private_browsing");
      } else if (authenticated) {
        if ($routeParams.token && $routeParams.id && $routeParams.url) {
          s.hideLoginForm = true;
          return $rootScope.changeRoute(url);
        } else if ($routeParams.error && $routeParams.url) {
          s.hideLoginForm = true;
          if ($routeParams.error === "already_in_use") {
            $rootScope.alert("The " + provider + " account that you have authorized with is already linked to another " + Teseda.name + " account. If you would like use it with this " + Teseda.name + " account, please unlink it first.");
          } else {
            $rootScope.alert("There was an error logging in via " + provider);
          }
          return $rootScope.changeRoute(url);
        }
      } else {
        log("initView()", logId);
        if ($routeParams.token && $routeParams.id && $routeParams.url) {
          s.hideLoginForm = true;
          $rootScope.currentUser = {
            auth_token: $routeParams.token,
            id: $routeParams.id
          };
          $http.defaults.headers.common["X-Auth-Token"] = $routeParams.token;
          deferred = $q.defer();
          deferred.promise.then(function(user) {
            return userService.loginSuccess(user, url);
          });
          return userService.refreshUser(deferred);
        } else if ($routeParams.error) {
          return s.changeRoute("/");
        } else {
          s.userInputAccount = {
            login: "",
            password: ""
          };
          s.isLoginFocused = false;
          s.isPasswordFocused = false;
          if ($rootScope.AppSettings.recentUsername) {
            s.userInputAccount.login = $rootScope.AppSettings.recentUsername;
          }
          s.providers = oauth.providers();
          if (!$rootScope.isCurrentLocation(["/card/new"])) {
            return $rootScope.isAuthenticated = false;
          }
        }
      }
    };
    if ($routeParams.p === "forgot") {
      s.recoveryText = "Forgot your password? Just fill in your username and we'll send you an email you can use to reset it.";
    }
    return initView($rootScope.isAuthenticated);
  }
]);
