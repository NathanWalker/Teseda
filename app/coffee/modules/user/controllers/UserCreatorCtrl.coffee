angular.module("User").controller("UserCreatorCtrl", ["LogService", "$scope", "$rootScope", "UserService", "StaticTextService", "OAuthService", (log, s, $rootScope, userService, statictext, oauth) ->
  logId = "UserCreatorCtrl"

  s.userInputAccount =
    login:''
    password:''

  s.providers = oauth.providers()

  s.cancel = () ->
    userService.removeView()

  s.save = () ->
    #$rootScope.persistLoading = true # show spinner
    #$rootScope.$broadcast Teseda.scope.events.site.updateLoadingMsg, statictext.wraps.creation
    userService.createUser(s.userInputAccount).then () ->
      $rootScope.changeRoute('/')

  s.saveWithBookmark = () ->
    $rootScope.persistLoading = true # show spinner
    userService.createUserFromBookmark(s.userInputAccount)

  s.providerSave = (provider) ->
    $rootScope.$broadcast Teseda.scope.events.site.updateLoadingMsg, statictext.wraps.createWithProvider(provider.label)
    $rootScope.$broadcast Teseda.scope.events.site.showLoading, true
    s.$on Teseda.scope.events.project.providerSaveReady, () ->
      $rootScope.refreshPageWithRoute(Teseda.uri.apiServerHost + provider.url + '?url=/new?provider=true')
    $rootScope.$broadcast Teseda.scope.events.project.providerSave,
      label: provider.label

  log "init()", logId
])
