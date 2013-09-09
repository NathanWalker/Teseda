AppControllers.controller "LoginCtrl", ["LogService", "$scope", "$rootScope", "$q", "$location", "$http", "$routeParams", "UserService", "LocalStorageService", "ModalService", (log, s, $rootScope, $q, $location, $http, $routeParams, userService, localStorageService, modal) ->
  logId = "LoginCtrl"

  initView = (authenticated) ->
    url = $routeParams.url

    if authenticated
      log('to do')

    else
      log "initView()", logId

      # set up Teseda native acccount login form
      s.userInputAccount =
        login: ""
        password: ""

      s.isLoginFocused = false
      s.isPasswordFocused = false
      s.userInputAccount.login = $rootScope.AppSettings.recentUsername  if $rootScope.AppSettings.recentUsername

  if $routeParams.p is "forgot"
    s.recoveryText = "Forgot your password? Just fill in your username and we'll send you an email you can use to reset it."

  s.login = (userInputAccount) ->
    if userInputAccount and userInputAccount.login and userInputAccount.password
      if Teseda.prop.clientOnline

        # http header auth token for all future requests is set in currentUser which is called by loginSuccess
        $http.post(Teseda.uri.apiServer + "login.json", {},
          headers:
            Authorization: "Basic " + Base64.encode(userInputAccount.login + ":" + userInputAccount.password)
        ).success((data) ->
          log (Teseda.uri.apiServer + "login.json") + " --- success result ---", logId
          log data.account
          $rootScope.RequireRemoteAuthentication = false
          $rootScope.AppSettings.recentUsername = userInputAccount.login
          userService.cacheLocally data.account, userService.loginSuccess

        ).error (data, status, headers, config) ->
          if status is 404 or status is 0
            if Teseda.prop.debug
              $rootScope.alert "Ensure you have the api running! Usually just means you need to run: rails s (in the api app)."
            else
              $rootScope.alert "A connection error occurred, please try again later."

    else
      userService.loginFailure()

  initView $rootScope.isAuthenticated
]
