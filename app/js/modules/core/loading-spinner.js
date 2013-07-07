angular.module("LoadingSpinner", ["Logger"]).config([
  "$provide", "$httpProvider", function($provide, $httpProvider) {
    $provide.factory('SpinnerInterceptor', [
      "LogService", "$q", "$rootScope", "LoadingService", function(log, $q, $rootScope, loadingService) {
        var api, excludeUrlParts, isConfigUrlApiRequest, isNotExcluded;

        excludeUrlParts = ['nearby'];
        isConfigUrlApiRequest = function(config) {
          return config && config.url && config.url.indexOf('json') > 1;
        };
        isNotExcluded = function(url) {
          var valid;

          valid = true;
          _.forEach(excludeUrlParts, function(excludedPart) {
            if (valid && url.indexOf(excludedPart) > -1) {
              return valid = false;
            }
          });
          return valid;
        };
        api = {};
        api.request = function(config) {
          if (isConfigUrlApiRequest(config) && isNotExcluded(config.url)) {
            if (!($rootScope.infiniteScrollLoading || $rootScope.gettingDataForGroup)) {
              loadingService.showAll();
            }
          }
          return config;
        };
        api.response = function(response) {
          if (response && isConfigUrlApiRequest(response.config)) {
            loadingService.hide();
          }
          return response;
        };
        api.responseError = function(rejection) {
          loadingService.hide();
          return $q.reject(rejection);
        };
        return api;
      }
    ]);
    return $httpProvider.interceptors.push('SpinnerInterceptor');
  }
]).factory("LoadingService", [
  "LogService", "$rootScope", function(log, $rootScope) {
    var api, loadingClass, loadingMsgClass, loadingScreen, modalBusyClass, toggleSpinner;

    loadingClass = "activity-indicator";
    loadingMsgClass = "loading-msg";
    modalBusyClass = "modal-busy";
    loadingScreen = $("<div class=\"" + loadingClass + "\"><div class=\"" + loadingMsgClass + "\"></div></div>").appendTo($("body")).hide();
    toggleSpinner = Teseda.util.toggleSpinner;
    api = {};
    api.showAll = function() {
      var $window, options, target, targetClass, targetOptions, targetSelector, winHeight, winWidth;

      target = loadingScreen;
      targetClass = loadingClass;
      targetOptions = {};
      options = {
        shadow: !Teseda.platform.IS_LEGACY_ANDROID
      };
      if ($(".modal").is(':visible')) {
        target = $("." + modalBusyClass);
        targetClass = modalBusyClass;
        targetOptions = {
          left: target.width() / 2,
          top: target.height() / 2
        };
      } else if (!$("." + loadingClass).is(':visible')) {
        $window = $(window);
        winWidth = $window.width();
        winHeight = $window.height();
        if (Teseda.platform.IS_MOBILE) {
          winHeight += 60;
        }
        target.css({
          width: "" + winWidth + "px",
          height: "" + winHeight + "px"
        });
        targetOptions = {
          left: (winWidth / 2) - 24,
          top: winHeight / 2
        };
      }
      targetSelector = "." + targetClass;
      _.extend(options, targetOptions);
      toggleSpinner(targetSelector, true, options);
      $(targetSelector).removeClass('darken');
      return target.show();
    };
    api.hideAll = function() {
      $("." + modalBusyClass).hide();
      loadingScreen.hide();
      $("." + loadingMsgClass).text('');
      toggleSpinner("." + loadingClass, false);
      return toggleSpinner("." + modalBusyClass, false);
    };
    api.hide = function() {
      if (!$rootScope.persistLoading) {
        return api.hideAll();
      }
    };
    return api;
  }
]).run([
  "$rootScope", "LoadingService", function($rootScope, loadingService) {
    $rootScope.$on(Teseda.scope.events.site.showLoading, function(e, darken) {
      $rootScope.persistLoading = true;
      loadingService.showAll();
      if (darken) {
        return $("." + loadingClass).addClass('darken');
      }
    });
    $rootScope.$on(Teseda.scope.events.site.cancelLoading, function() {
      $rootScope.persistLoading = false;
      return loadingService.hideAll();
    });
    return $rootScope.$on(Teseda.scope.events.site.updateLoadingMsg, function(e, msg) {
      return $("." + loadingMsgClass).text(msg);
    });
  }
]);
