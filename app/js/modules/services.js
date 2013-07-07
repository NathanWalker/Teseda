var AppServices;

AppServices = window.AppServices = angular.module('AppServices', []);

AppServices.factory('CrudCtrlService', [
  'LogService', '$rootScope', '$location', function(log, $rootScope, $location) {
    /*
      CRUD View Initialization
    */

    var api;

    api = {
      init: function(s, logId, viewFolder, supportedPages, resource, page) {
        var authPages, isNew;

        log("init()" + (resource ? ' for id: ' + resource.id : ''), logId);
        authPages = ['edit'];
        isNew = _.last($location.path().split('/') === 'new');
        if (resource) {
          if (page) {
            if (supportedPages && _.contains(supportedPages, page)) {
              if (_.contains(authPages, page) && !$rootScope.isAuthenticated) {
                log("page required authentication!");
                $rootScope.$broadcast(Teseda.scope.events.errors.unauthorized);
                return;
              }
              return s.templateUrl = "" + CONFIG.viewDirectory + viewFolder + "/" + page + ".html";
            } else {
              log("appears to not support page: " + page, logId);
              return $rootScope.pageNotFound();
            }
          } else {
            return s.templateUrl = "" + CONFIG.viewDirectory + viewFolder + "/show.html";
          }
        } else if (isNew) {
          return s.templateUrl = "" + CONFIG.viewDirectory + viewFolder + "/new.html";
        } else {
          return s.templateUrl = "" + CONFIG.viewDirectory + viewFolder + "/index.html";
        }
      }
    };
    return api;
  }
]);
