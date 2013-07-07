AppControllers.controller "LoginCtrl", ["LogService", "$scope", "$rootScope", "$q", "$location", "$http", "$routeParams", "UserService", "LocalStorageService", "OAuthService", "ModalService", (log, s, $rootScope, $q, $location, $http, $routeParams, userService, localStorageService, oauth, modal) ->
  logId = "LoginCtrl"

  s.providerLogin = (provider) ->
    token = ($rootScope.currentUser or {}).auth_token
    if provider.label is "Email"
      s.toggleTesedaLogin true
    else
      url = Teseda.uri.apiServerHost + provider.url + "?url=/"
      url += "&token=" + token  if token
      $rootScope.refreshPageWithRoute url

  s.showLoginModal = () ->
    modal.open('views/site/login-modal.html', 'Login using your email')

  initView = (authenticated) ->
    modal.close() # always ensure modal is closed
    s.$emit Teseda.scope.events.site.rootViewReady
    url = $routeParams.url
    provider = (oauth.providers()[$routeParams.provider] or {}).label or "third party"
    if localStorageService.privateBrowsingEnabled
      $rootScope.changeRoute "/private_browsing" # just show notice
    else if authenticated

      # user is already authenticated
      if $routeParams.token and $routeParams.id and $routeParams.url

        # 3rd party auth success: since we're already logged in, we must be adding an additional 3rd party auth
        s.hideLoginForm = true
        $rootScope.changeRoute url
      else if $routeParams.error and $routeParams.url

        # 3rd party auth falure
        s.hideLoginForm = true
        if $routeParams.error is "already_in_use"
          $rootScope.alert "The #{provider} account that you have authorized with is already linked to another #{Teseda.name} account. If you would like use it with this #{Teseda.name} account, please unlink it first."
        else
          $rootScope.alert "There was an error logging in via #{provider}"
        $rootScope.changeRoute url
    else
      log "initView()", logId

      # user is not yet authenticated
      if $routeParams.token and $routeParams.id and $routeParams.url

        # 3rd party auth success: get the full current account based on the token and ID
        s.hideLoginForm = true
        $rootScope.currentUser =
          auth_token: $routeParams.token
          id: $routeParams.id

        $http.defaults.headers.common["X-Auth-Token"] = $routeParams.token
        deferred = $q.defer()
        deferred.promise.then (user) ->
          #s.global.RequireRemoteAuthentication = false;
          userService.loginSuccess(user, url)

        userService.refreshUser(deferred)


      else if $routeParams.error

        # 3rd party auth falure
        # either show an error here or eliminate this if clause and drop directly into normal login setup
        s.changeRoute "/"
      else

        # set up Teseda native acccount login form
        s.userInputAccount =
          login: ""
          password: ""

        s.isLoginFocused = false
        s.isPasswordFocused = false
        s.userInputAccount.login = $rootScope.AppSettings.recentUsername  if $rootScope.AppSettings.recentUsername
        s.providers = oauth.providers()
        $rootScope.isAuthenticated = false  unless $rootScope.isCurrentLocation(["/card/new"])

  if $routeParams.p is "forgot"
    s.recoveryText = "Forgot your password? Just fill in your username and we'll send you an email you can use to reset it."
  initView $rootScope.isAuthenticated
]
