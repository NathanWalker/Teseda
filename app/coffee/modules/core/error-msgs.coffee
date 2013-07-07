angular.module("ErrorMsgs.config", []).value('ErrorMsgs.config', { showMessages: true })
angular.module("ErrorMsgs", ['ErrorMsgs.config', "StaticText"]).config(["$provide", "$httpProvider", "$compileProvider", ($provide, $httpProvider, $compileProvider) ->
  errorMsgElements = []

  $provide.factory 'ErrorMsgsInterceptor', ["LogService", "ErrorMsgs.config", "$rootScope", "$timeout", "$q", "StaticTextService", (log, config, $rootScope, $timeout, $q, statictext) ->

    showMessage = (content, cl, time) ->

      # append error messages to all errorMsgs
      if config.showMessages
        _.forEach errorMsgElements, (el) ->
          el.html "" # always clear first
          $("<div/>").addClass("message").addClass(cl).hide().fadeIn("fast").delay(time).fadeOut("fast", ->
            $(this).remove()
          ).appendTo(el).text content
      else
        log content, null, 'error'

    api = {}

    api.response = (response) ->
      _.forEach errorMsgElements, (el) ->
        el.html "" # always clear error msgs first

      errorMsgElements = []
      response

    api.responseError = (response) ->
      response.status = 401  if response.status is 401 or (not $rootScope.isAuthenticated and $rootScope.isCurrentLocation(CONFIG.routing.authorizedRoutes))
      response.status = 500  if response.status is 0
      switch response.status
        when 401
          $rootScope.RequireRemoteAuthentication = true
          if $rootScope.isCurrentLocation(["/", "/wrap/new"])
            showMessage statictext.login.errorMsg, "errorMessage", 10000
            $rootScope.$broadcast Teseda.scope.events.user.loginRequired, true
          else
            showMessage statictext.login.errorUnauthorized, "errorMessage", 10000
            $rootScope.$broadcast Teseda.scope.events.errors.unauthorized, $rootScope.isCurrentLocation(CONFIG.routing.authorizedRoutes)
        when 403
          showMessage "You don't have the right to do this", "errorMessage", 10000
        when 422
          # allow error to pass through to the proper service for conditional error handling dependant on resource type
          return response
        when 500
          showMessage "Server internal error: " + response.data, "errorMessage", 10000
          url = response.config.url
          log "DATA-NG-INCLUDE LOAD ERROR: #{url} does not exist!"  if url.indexOf(".html") > -1
          $rootScope.$broadcast Teseda.scope.events.errors.internalServerError
        else
          showMessage "Error " + response.status + ": " + response.data, "errorMessage", 10000
      $q.reject response

    api

  ]

  $httpProvider.interceptors.push('ErrorMsgsInterceptor')

  $compileProvider.directive "errorMsgs", ->
    directiveDefinitionObject = link: (scope, element, attrs) ->
      errorMsgElements.push element

    directiveDefinitionObject

])
