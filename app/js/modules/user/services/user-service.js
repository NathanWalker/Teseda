angular.module("User").factory("UserService", [
  "LogService", "User.config", "$rootScope", "$location", "$q", "LocalStorageService", "ResourceService", "UXTrackingService", "$http", 'StaticTextService', 'ModalService', '$window', 'RestApiService', function(log, config, $rootScope, $location, $q, localStorageService, rs, ux, $http, statictext, modal, $window, RestApiService) {
    var api, logId, saveUser;

    logId = "UserService";
    /*
    PRIVATE
    */

    saveUser = function(account, params) {
      var defer, options;

      defer = $q.defer();
      account.login = account.email;
      _.extend({
        account: account
      }, params);
      options = {
        type: 'account',
        data: account
      };
      rs.save(options).then(function() {
        var header;

        header = {
          headers: {
            Authorization: "Basic " + Base64.encode(account.login + ":" + account.password)
          }
        };
        return $http.post(Teseda.uri.apiServer + "login.json", {}, header).success(function(data) {
          var user;

          log(data.account);
          user = data.account;
          $rootScope.RequireRemoteAuthentication = false;
          $rootScope.AppSettings.recentUsername = user.login;
          return api.cacheLocally(user).then(function() {
            $rootScope.currentProject = $rootScope.currentUserProjectDefaultFrom(user);
            return defer.resolve();
          });
        }).error(function(user) {
          return defer.reject();
        });
      }, function(result) {
        $rootScope.$broadcast(Teseda.scope.events.site.cancelLoading);
        return defer.reject();
      });
      return defer.promise;
    };
    /*
    PUBLIC
    */

    api = {};
    api.cacheLocally = function(user) {
      var defer;

      defer = $q.defer();
      api.setAuthToken(user);
      localStorageService.save(Teseda.localStorage.keyNames.currentUser, user).then(function() {
        $rootScope.currentUser = user;
        $rootScope.isAuthenticated = true;
        return defer.resolve(user);
      }, function(error) {
        return defer.reject();
      });
      return defer.promise;
    };
    api.createUser = function(input) {
      var account, defer;

      log(input);
      defer = $q.defer();
      account = input;
      saveUser(account, {}).then(function() {
        ux.track(ux.events.ACCOUNT_CREATED, {
          category: ux.categories.USER,
          label: $rootScope.currentUser.email,
          value: $rootScope.currentUser.id
        });
        return defer.resolve();
      });
      return defer.promise;
    };
    api.createUserFromBookmark = function(input) {
      var account;

      log('createUserFromBookmark');
      log(input);
      account = input;
      account.password = Teseda.util.randomCharacters(12);
      return saveUser(account, {
        star_card: true
      }).then(function() {
        ux.track(ux.events.ACCOUNT_CREATED_WITH_BOOKMARK, {
          category: ux.categories.USER,
          label: $rootScope.currentUser.email,
          value: $rootScope.currentUser.id
        });
        log('user created with bookmark save');
        $rootScope.$broadcast(Teseda.scope.events.bookmarks.saveFromLocal);
        return $rootScope.$broadcast(Teseda.scope.events.site.cancelLoading);
      });
    };
    api.removeView = function() {
      return $('.user-creator').remove();
    };
    api.getUserWraps = function(user) {
      var options;

      options = {
        type: 'wrap',
        accountId: user ? user.id : $rootScope.currentUser.id
      };
      return rs.get(options);
    };
    api.refreshUser = function() {
      var defer, options;

      defer = $q.defer();
      if (Teseda.prop.clientOnline && $rootScope.currentUser && $rootScope.currentUser.id) {
        options = {
          type: 'account',
          id: $rootScope.currentUser.id
        };
        rs.get(options).then(function(user) {
          log("rs.get({id:" + $rootScope.currentUser.id + "})", logId);
          log(user);
          _.extend(user, {
            auth_token: $rootScope.currentUser.auth_token
          });
          return api.cacheLocally(user).then(function() {
            var activeProject, defaultProject, operatingAsProject;

            operatingAsProject = void 0;
            $rootScope.currentUser = user;
            defaultProject = $rootScope.currentUserProjectDefaultFrom(user);
            if ($rootScope.currentProject) {
              operatingAsProject = _.find(user.wraps, function(project) {
                return project.id === $rootScope.currentProject.id;
              });
              if (operatingAsProject) {
                activeProject = operatingAsProject;
                $rootScope.currentProject = operatingAsProject;
              } else if (defaultProject) {
                activeProject = defaultProject;
                $rootScope.switchProject(defaultProject);
              } else {
                $rootScope.switchProject(_.first($rootScope.currentUserProjects()));
              }
            } else {
              $rootScope.currentProject = defaultProject;
            }
            $rootScope.$broadcast(Teseda.scope.events.user.refreshSuccess, user);
            return defer.resolve(user);
          });
        }, function(error) {
          return defer.reject(error);
        });
      } else {
        defer.reject();
      }
      return defer.promise;
    };
    api.setAuthToken = function(user) {
      if (user && _.isObject(user)) {
        return $http.defaults.headers.common["X-Auth-Token"] = user.auth_token;
      } else {
        if (user === null) {
          return delete $http.defaults.headers.common["X-Auth-Token"];
        }
      }
    };
    api.loadCachedUser = function() {
      var defer;

      defer = $q.defer();
      localStorageService.getAll(Teseda.localStorage.keyNames.currentUser).then(function(user) {
        var cacheUserOnScope;

        if (_.isNothing(user)) {
          return defer.reject();
        } else {
          api.setAuthToken(user);
          cacheUserOnScope = function() {
            var currentlySavedProjectId, firstProject, validProject;

            $rootScope.currentUser = user;
            firstProject = _.first($rootScope.currentUserProjects());
            currentlySavedProjectId = $rootScope.AppSettings.currentProjectID;
            if (currentlySavedProjectId) {
              validProject = _.find($rootScope.currentUserProjects(), function(project) {
                return project.id === currentlySavedProjectId;
              });
              $rootScope.currentProject = validProject || firstProject;
            } else {
              $rootScope.currentProject = firstProject;
            }
            if ($rootScope.currentProject) {
              $rootScope.AppSettings.currentProjectID = $rootScope.currentProject.id;
            }
            return defer.resolve(user);
          };
          return api.getUserWraps(user).then(function(wraps) {
            _.extend(user, {
              wraps: wraps
            });
            return cacheUserOnScope();
          });
        }
      });
      return defer.promise;
    };
    api.checkIfLocallyAuthenticated = function() {
      var defer, resolver;

      defer = $q.defer();
      if ($rootScope.RequireRemoteAuthentication) {
        $rootScope.changeRoute("/");
        defer.reject(false);
      } else {
        resolver = function(user) {
          if (!_.isNothing(user)) {
            return defer.resolve(true);
          } else {
            return defer.reject(false);
          }
        };
        api.loadCachedUser().then(resolver, resolver);
      }
      return defer.promise;
    };
    api.loginSuccess = function(user, url) {
      var continueFlow, defaultProject;

      $rootScope.currentUser = user;
      defaultProject = $rootScope.currentUserProjectDefaultFrom(user);
      $rootScope.currentProject = defaultProject || _.first($rootScope.currentUserProjects());
      $rootScope.isAuthenticated = true;
      Teseda.util.hideBarScrollTo(50);
      ux.track(ux.events.LOGGED_IN, {
        category: ux.categories.USER,
        label: $rootScope.currentUser.email,
        value: $rootScope.currentUser.id
      });
      crs.projectsNearby.stopPolling();
      continueFlow = function() {
        $rootScope.$broadcast(Teseda.scope.events.bookmarks.saveFromLocal);
        return $rootScope.changeRoute("/");
      };
      modal.close();
      if (url) {
        return $rootScope.changeRoute(url);
      } else {
        return continueFlow();
      }
    };
    api.loginFailure = function() {
      return $rootScope.$broadcast(Teseda.scope.events.user.loginRequired, true);
    };
    api.logout = function() {
      var defer, trackedValue;

      defer = $q.defer();
      trackedValue = $rootScope.currentUser.email || $rootScope.currentUser.login;
      if ($rootScope.currentUser && trackedValue) {
        ux.track(ux.events.LOGGED_OUT, {
          category: ux.categories.USER,
          label: trackedValue,
          value: $rootScope.currentUser.id
        });
        localStorageService.reset(Teseda.localStorage.keyNames.currentUser).then(function() {
          $rootScope.isAuthenticated = false;
          $rootScope.currentUser = null;
          api.setAuthToken(null);
          $rootScope.currentProject = null;
          $rootScope.AppSettings.broadcastProjectUntil = null;
          crs.currentProjectConnections.clear();
          crs.bookmarkedProjects.clear();
          defer.resolve();
          return $rootScope.safeApply();
        });
      } else {
        defer.resolve();
      }
      return defer.promise;
    };
    api.init = function() {
      var notifyInit;

      log('init()', logId);
      notifyInit = function(isAuthenticated) {
        $rootScope.isAuthenticated = isAuthenticated;
        $rootScope.userInitialized = true;
        return $rootScope.$broadcast(Teseda.scope.events.user.initialized);
      };
      if (localStorageService.privateBrowsingEnabled) {
        return notifyInit(false);
      } else {
        return api.checkIfLocallyAuthenticated().then(function(isAuthenticated) {
          log("checkIfLocallyAuthenticated(): " + isAuthenticated, logId);
          return notifyInit(isAuthenticated);
        }, function() {
          return notifyInit(false);
        });
      }
    };
    return api;
  }
]);
