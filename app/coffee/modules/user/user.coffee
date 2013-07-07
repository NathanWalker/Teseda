
###
  User Service
###

angular.module("User.config", []).value("User.config", {})
angular.module("User", ["Logger", "User.config", "StaticText", "Resource"]).run(["LogService", "$rootScope", "$location", "StaticTextService", "UserService", "ModalService", "ResourceService", (log, $rootScope, $location, statictext, userService, modal, rs) ->

  # init global state
  $rootScope.isAuthenticated = false
  $rootScope.userInitialized = false
  $rootScope.currentUser = {}

  $rootScope.isCurrentUserLocation = (routeArray) ->
    if $rootScope.currentUser
      _.any routeArray, (route) ->
        $location.url() is "/account/" + $rootScope.currentUser.id + route

    else
      false

  $rootScope.changeCurrentUserRoute = (route) ->
    $rootScope.changeRoute("/account/" + $rootScope.currentUser.id + route)

  $rootScope.logout = () ->
    userService.logout().then () ->
      $rootScope.changeRoute('/')

  # User Settings
  $rootScope.openSettings = () ->
    modal.open('views/account/settings.html', 'Account', 'account-settings')

  # WATCHERS
  $rootScope.$watch "isAuthenticated", (val) ->
    $rootScope.$broadcast (if val then Teseda.scope.events.user.authenticatedYes else Teseda.scope.events.user.authenticatedNo)

  # EVENTS
  $rootScope.$on Teseda.scope.events.user.refresh, (e) ->
    userService.refreshUser()

  $rootScope.$on rs.events.ready, () ->
    $rootScope.$on rs.events.account.update, (e, user) ->
      # persist updates locally
      _.extend user, { auth_token: $rootScope.currentUser.auth_token }

      userService.cacheLocally(user).then ->
        $rootScope.alert statictext.accountSettings.updated
        rs.closeView()
])
