angular.module("User").directive("bbUserCreator", ["$rootScope", "$timeout", "$http", "$compile", ($rootScope, $timeout, $http, $compile) ->
  link = (scope, element, attrs) ->
    scope.$on Teseda.scope.events.user.createNew, () ->
      $http.get('template/components/user-creator/save.html').success (result) ->
        $template = angular.element(result)
        $compile($template)(scope)
        $('body').append($template)

  restrict:"A"
  link:link

]).directive("bbUserSettings", ->
  restrict:"A"
  controller:'UserSettingsCtrl'
  replace:true
  templateUrl:'template/components/user/settings.html'
).directive("bbUserConnectedNetworks", ->
  restrict:"A"
  controller:'UserConnectedNetworksCtrl'
  replace:true
  templateUrl:'template/components/user/connected-networks.html'
)
