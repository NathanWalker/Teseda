angular.module("ErrorMsgs.config", []).value('ErrorMsgs.config', {
  showMessages: true
});

angular.module("ErrorMsgs", ['ErrorMsgs.config', "StaticText"]).config([
  "$provide", "$httpProvider", "$compileProvider", function($provide, $httpProvider, $compileProvider) {
    var errorMsgElements;

    errorMsgElements = [];
    $provide.factory('ErrorMsgsInterceptor', [
      "LogService", "ErrorMsgs.config", "$rootScope", "$timeout", "$q", "StaticTextService", function(log, config, $rootScope, $timeout, $q, statictext) {
        var api, showMessage;

        showMessage = function(content, cl, time) {
          if (config.showMessages) {
            return _.forEach(errorMsgElements, function(el) {
              el.html("");
              return $("<div/>").addClass("message").addClass(cl).hide().fadeIn("fast").delay(time).fadeOut("fast", function() {
                return $(this).remove();
              }).appendTo(el).text(content);
            });
          } else {
            return log(content, null, 'error');
          }
        };
        api = {};
        api.response = function(response) {
          _.forEach(errorMsgElements, function(el) {
            return el.html("");
          });
          errorMsgElements = [];
          return response;
        };
        api.responseError = function(response) {
          var url;

          if (response.status === 401 || (!$rootScope.isAuthenticated && $rootScope.isCurrentLocation(CONFIG.routing.authorizedRoutes))) {
            response.status = 401;
          }
          if (response.status === 0) {
            response.status = 500;
          }
          switch (response.status) {
            case 401:
              $rootScope.RequireRemoteAuthentication = true;
              if ($rootScope.isCurrentLocation(["/", "/wrap/new"])) {
                showMessage(statictext.login.errorMsg, "errorMessage", 10000);
                $rootScope.$broadcast(Teseda.scope.events.user.loginRequired, true);
              } else {
                showMessage(statictext.login.errorUnauthorized, "errorMessage", 10000);
                $rootScope.$broadcast(Teseda.scope.events.errors.unauthorized, $rootScope.isCurrentLocation(CONFIG.routing.authorizedRoutes));
              }
              break;
            case 403:
              showMessage("You don't have the right to do this", "errorMessage", 10000);
              break;
            case 422:
              return response;
            case 500:
              showMessage("Server internal error: " + response.data, "errorMessage", 10000);
              url = response.config.url;
              if (url.indexOf(".html") > -1) {
                log("DATA-NG-INCLUDE LOAD ERROR: " + url + " does not exist!");
              }
              $rootScope.$broadcast(Teseda.scope.events.errors.internalServerError);
              break;
            default:
              showMessage("Error " + response.status + ": " + response.data, "errorMessage", 10000);
          }
          return $q.reject(response);
        };
        return api;
      }
    ]);
    $httpProvider.interceptors.push('ErrorMsgsInterceptor');
    return $compileProvider.directive("errorMsgs", function() {
      var directiveDefinitionObject;

      directiveDefinitionObject = {
        link: function(scope, element, attrs) {
          return errorMsgElements.push(element);
        }
      };
      return directiveDefinitionObject;
    });
  }
]);
