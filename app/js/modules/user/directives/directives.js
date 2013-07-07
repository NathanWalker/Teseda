angular.module("User").directive("bbUserCreator", [
  "$rootScope", "$timeout", "$http", "$compile", function($rootScope, $timeout, $http, $compile) {
    var link;

    link = function(scope, element, attrs) {
      return scope.$on(Teseda.scope.events.user.createNew, function() {
        return $http.get('template/components/user-creator/save.html').success(function(result) {
          var $template;

          $template = angular.element(result);
          $compile($template)(scope);
          return $('body').append($template);
        });
      });
    };
    return {
      restrict: "A",
      link: link
    };
  }
]).directive("bbUserSettings", function() {
  return {
    restrict: "A",
    controller: 'UserSettingsCtrl',
    replace: true,
    templateUrl: 'template/components/user/settings.html'
  };
}).directive("bbUserConnectedNetworks", function() {
  return {
    restrict: "A",
    controller: 'UserConnectedNetworksCtrl',
    replace: true,
    templateUrl: 'template/components/user/connected-networks.html'
  };
});
