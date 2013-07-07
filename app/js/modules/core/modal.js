/*
  Modal Service
*/
angular.module("Modal.config", []).value("Modal.config", {});

angular.module("Modal", ["Logger", "Modal.config"]).factory("ModalService", [
  "LogService", "Modal.config", "$q", "$window", "$timeout", "$rootScope", function(log, config, $q, $window, $timeout, $rootScope) {
    var api, logId, savedPageScrollHeight;

    logId = "ModalService";
    savedPageScrollHeight = 0;
    api = {};
    api.close = function(canceled) {
      var defer;

      defer = $q.defer();
      defer.promise.then(function() {
        log('close()', logId);
        if (savedPageScrollHeight) {
          $timeout(function() {
            return $($window).scrollTop(savedPageScrollHeight);
          }, Teseda.platform.IS_MOBILE ? 300 : 100);
        }
        $rootScope.modalEnabled = false;
        return $rootScope.$broadcast(Teseda.scope.events.modal.close, canceled);
      });
      $rootScope.$broadcast(Teseda.scope.events.modal.shouldClose, defer);
      return $rootScope.safeApply();
    };
    api.open = function(templateUrl, title, className) {
      log('open()', logId);
      savedPageScrollHeight = $($window).scrollTop();
      $rootScope.modalTemplateUrl = templateUrl;
      $rootScope.modalTitle = title;
      $rootScope.modalEnabled = true;
      $rootScope.modalClass = "modal" + (className ? " " + className : '');
      return $rootScope.safeApply();
    };
    api.updateTitle = function(title) {
      return $rootScope.modalTitle = title;
    };
    return api;
  }
]).directive("bbModal", function() {
  var link;

  link = function(scope, element, attrs) {};
  return {
    restrict: "A",
    replace: true,
    templateUrl: 'template/components/modal.html',
    link: link
  };
}).run([
  "$rootScope", "ModalService", function($rootScope, modal) {
    return $rootScope.modalClose = function(e) {
      if (!_.isNothing(e)) {
        e.stopPropagation();
      }
      modal.close(true);
      return $rootScope.$broadcast(Teseda.scope.events.modal.backdropclick);
    };
  }
]);
