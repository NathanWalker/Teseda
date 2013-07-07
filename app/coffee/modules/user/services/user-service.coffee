angular.module("User").factory("UserService", ["LogService", "User.config", "$rootScope", "$location", "$q","LocalStorageService", "ResourceService", "UXTrackingService", "$http", 'StaticTextService', 'ModalService', '$window', 'RestApiService', (log, config, $rootScope, $location, $q, localStorageService, rs, ux, $http, statictext, modal, $window, RestApiService) ->
  logId = "UserService"

  ###
  PRIVATE
  ###
  saveUser = (account, params) ->
    defer = $q.defer()
    account.login = account.email
    #account.agreed_to_terms = true

    # customize post if needed with params
    _.extend {account: account}, params

    options =
      type:'account'
      data:account

    rs.save(options).then () ->
      # authenticate with account to get auth_token
      # http header auth token for all future requests is set in currentUser which is called by loginSuccess
      header =
        headers: Authorization: "Basic " + Base64.encode(account.login + ":" + account.password)
      $http.post(Teseda.uri.apiServer + "login.json", {}, header)
      .success (data) ->
        log data.account
        user = data.account
        $rootScope.RequireRemoteAuthentication = false
        $rootScope.AppSettings.recentUsername = user.login
        api.cacheLocally(user).then ->
          $rootScope.currentProject = $rootScope.currentUserProjectDefaultFrom(user)
          defer.resolve()
      .error (user) ->
        #possible switch of errors
        defer.reject()
    , (result) ->
      $rootScope.$broadcast Teseda.scope.events.site.cancelLoading
      defer.reject()

    defer.promise

  ###
  PUBLIC
  ###
  api = {}

  api.cacheLocally = (user) ->
    defer = $q.defer()
    # set global $http header for auth token
    api.setAuthToken(user)

    localStorageService.save(Teseda.localStorage.keyNames.currentUser, user).then ->
      $rootScope.currentUser = user
      $rootScope.isAuthenticated = true
      defer.resolve(user)
    , (error) ->
      defer.reject()

    defer.promise

  # CREATE
  api.createUser = (input) ->
    log input
    defer = $q.defer()
    account = input

    saveUser(account, {}).then () ->
      ux.track ux.events.ACCOUNT_CREATED,
        category: ux.categories.USER
        label: $rootScope.currentUser.email
        value: $rootScope.currentUser.id

      # $rootScope.$on res.events.wrap.update, () ->
      #   api.removeView()

      # $rootScope.$broadcast Teseda.scope.events.project.accountReady
      defer.resolve()

    defer.promise

  api.createUserFromBookmark = (input) ->
    log 'createUserFromBookmark'
    log input
    account = input

    # randomly generate password
    account.password = Teseda.util.randomCharacters(12)
    saveUser(account, { star_card: true }).then () ->
      ux.track ux.events.ACCOUNT_CREATED_WITH_BOOKMARK,
        category: ux.categories.USER
        label: $rootScope.currentUser.email
        value: $rootScope.currentUser.id
      log 'user created with bookmark save'
      $rootScope.$broadcast Teseda.scope.events.bookmarks.saveFromLocal
      $rootScope.$broadcast Teseda.scope.events.site.cancelLoading


  api.removeView = () ->
    $('.user-creator').remove()

  api.getUserWraps = (user) ->
    options =
      type:'wrap'
      accountId: if user then user.id else $rootScope.currentUser.id
    rs.get(options)

  # REFRESH
  api.refreshUser = () ->
    defer = $q.defer()
    if Teseda.prop.clientOnline and $rootScope.currentUser and $rootScope.currentUser.id
      options =
        type:'account'
        id: $rootScope.currentUser.id

      rs.get(options).then (user) ->
        log("rs.get({id:" + $rootScope.currentUser.id + "})", logId)
        log(user)
        _.extend(user, {auth_token:$rootScope.currentUser.auth_token})

        api.cacheLocally(user).then ->
          operatingAsProject = undefined

          # refresh currentUser and currentProject
          $rootScope.currentUser = user
          defaultProject = $rootScope.currentUserProjectDefaultFrom(user)

          if $rootScope.currentProject
            operatingAsProject = _.find(user.wraps, (project) ->
              project.id is $rootScope.currentProject.id)

            if operatingAsProject
              # it's possible that after updating data, they may have deleted their operating project remotely
              # therefore, only set if in fact that same operating project is still found in user
              activeProject = operatingAsProject
              $rootScope.currentProject = operatingAsProject
            else if defaultProject
              activeProject = defaultProject
              $rootScope.switchProject defaultProject
            else
              # default project was deleted
              # fallback to first wrap in collection
              $rootScope.switchProject _.first($rootScope.currentUserProjects())
          else
              # if there wasn't a currentProject set, just set it
            $rootScope.currentProject = defaultProject

          $rootScope.$broadcast(Teseda.scope.events.user.refreshSuccess, user)
          defer.resolve(user)
      , (error) ->
        defer.reject(error)
        # handle error message?
    else
      defer.reject()
      # user not online error message? switch?
    defer.promise

  api.setAuthToken = (user) ->
    if user and _.isObject(user)

      # set $http request headers for authorization
      $http.defaults.headers.common["X-Auth-Token"] = user.auth_token

      # remove auth header
    else delete $http.defaults.headers.common["X-Auth-Token"]  if user is null

  api.loadCachedUser = () ->
    defer = $q.defer()
    localStorageService.getAll(Teseda.localStorage.keyNames.currentUser).then (user) ->
      if _.isNothing(user)
        # not found
        defer.reject()
      else
        api.setAuthToken(user)

        cacheUserOnScope = () ->
          # cache the user on the scope
          $rootScope.currentUser = user

          # set a project if ones available
          # grab first project
          firstProject = _.first($rootScope.currentUserProjects())

          # check if last used project was set last time
          currentlySavedProjectId = $rootScope.AppSettings.currentProjectID
          if currentlySavedProjectId
            # ensure the last saved wrap is still available on the user
            validProject = _.find $rootScope.currentUserProjects(), (project) ->
              project.id is currentlySavedProjectId
            $rootScope.currentProject = validProject or firstProject
          else
            $rootScope.currentProject = firstProject

          if $rootScope.currentProject
            # update last used project setting
            $rootScope.AppSettings.currentProjectID = $rootScope.currentProject.id

          defer.resolve(user)

        # always refresh users wraps collection when pulling out of cache
        api.getUserWraps(user).then (wraps) ->
          _.extend(user, {wraps: wraps})
          cacheUserOnScope()

    defer.promise

  api.checkIfLocallyAuthenticated = () ->
    defer = $q.defer()
    if $rootScope.RequireRemoteAuthentication
      # prevent recursive loop if LocalStorage has invalid data and thinks currentUser is logged in already
      $rootScope.changeRoute "/"
      defer.reject(false)
    else
      resolver = (user) ->
        unless _.isNothing(user)
          defer.resolve(true)
        else
          defer.reject(false)
      api.loadCachedUser().then(resolver, resolver)


    defer.promise

  api.loginSuccess = (user, url) ->
    $rootScope.currentUser = user
    defaultProject = $rootScope.currentUserProjectDefaultFrom(user)
    # there's a possibility that default_card_id was removed, therefore default from user may find nothing
    # resort to setting the user into the first project found
    $rootScope.currentProject = defaultProject or  _.first($rootScope.currentUserProjects())
    $rootScope.isAuthenticated = true

    # always ensure window is at scrolltop after login
    Teseda.util.hideBarScrollTo(50)

    ux.track ux.events.LOGGED_IN,
      category: ux.categories.USER
      label: $rootScope.currentUser.email
      value: $rootScope.currentUser.id

    crs.projectsNearby.stopPolling()

    continueFlow = ->

      $rootScope.$broadcast Teseda.scope.events.bookmarks.saveFromLocal
      $rootScope.changeRoute "/"

    # ensure login modal is closed
    modal.close()

    if url
      $rootScope.changeRoute url
    else
      continueFlow()

  api.loginFailure = ->
    $rootScope.$broadcast Teseda.scope.events.user.loginRequired, true

  api.logout = () ->
    defer = $q.defer()
    # in the case of a 'twitter' registered user, they may not have an email and instead will just have a random login
    # report the right value to ux tracking
    trackedValue = $rootScope.currentUser.email or $rootScope.currentUser.login
    if $rootScope.currentUser and trackedValue
      ux.track ux.events.LOGGED_OUT,
        category: ux.categories.USER
        label: trackedValue
        value: $rootScope.currentUser.id

      localStorageService.reset(Teseda.localStorage.keyNames.currentUser).then ->

        $rootScope.isAuthenticated = false
        $rootScope.currentUser = null
        api.setAuthToken(null)

        $rootScope.currentProject = null
        $rootScope.AppSettings.broadcastProjectUntil = null

        # clear appropriate cached resources
        crs.currentProjectConnections.clear()
        crs.bookmarkedProjects.clear()

        #msgPollingReset(); // kill msg polling
        defer.resolve()
        $rootScope.safeApply()
    else
      # no logged in user
      defer.resolve()

    defer.promise

  api.init = () ->
    log 'init()', logId
    notifyInit = (isAuthenticated) ->
      $rootScope.isAuthenticated = isAuthenticated
      $rootScope.userInitialized = true
      $rootScope.$broadcast Teseda.scope.events.user.initialized

    if localStorageService.privateBrowsingEnabled
      notifyInit(false)
    else
      api.checkIfLocallyAuthenticated().then (isAuthenticated)->
        log "checkIfLocallyAuthenticated(): #{isAuthenticated}", logId
        notifyInit(isAuthenticated)
      , () ->
        notifyInit(false)

  api

])
