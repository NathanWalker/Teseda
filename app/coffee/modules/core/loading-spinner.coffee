angular.module("LoadingSpinner", ["Logger"]).config(["$provide", "$httpProvider", ($provide, $httpProvider) ->

  $provide.factory 'SpinnerInterceptor', ["LogService", "$q", "$rootScope", "LoadingService", (log, $q, $rootScope, loadingService) ->
    # define any particular url parts that you do not want to show a loading spinner for when requested
    excludeUrlParts = ['nearby']

    isConfigUrlApiRequest = (config) ->
      config and config.url and config.url.indexOf('json') > 1

    isNotExcluded = (url) ->
      valid = true
      _.forEach excludeUrlParts, (excludedPart) ->
        if valid and url.indexOf(excludedPart) > -1
          valid = false
      return valid

    api = {}

    api.request = (config) ->
      if isConfigUrlApiRequest(config) and isNotExcluded(config.url)
        unless $rootScope.infiniteScrollLoading or $rootScope.gettingDataForGroup
          # always ignore when infinite scroll is loading
          loadingService.showAll()
      config

    api.response = (response) ->
      if response and isConfigUrlApiRequest(response.config)
        # only hide when handling a response from a json api call
        loadingService.hide()
      response

    api.responseError = (rejection) ->
      loadingService.hide()
      $q.reject(rejection)

    api

  ]
  $httpProvider.interceptors.push('SpinnerInterceptor')

])
.factory("LoadingService", ["LogService", "$rootScope", (log, $rootScope) ->

  loadingClass = "activity-indicator"
  loadingMsgClass = "loading-msg"
  modalBusyClass = "modal-busy"
  loadingScreen = $("<div class=\"#{loadingClass}\"><div class=\"#{loadingMsgClass}\"></div></div>").appendTo($("body")).hide()
  toggleSpinner = Teseda.util.toggleSpinner

  api = {}

  api.showAll = () ->
    target = loadingScreen
    targetClass = loadingClass
    targetOptions = {}
    options =
      shadow: not Teseda.platform.IS_LEGACY_ANDROID

    if $(".modal").is(':visible')
      # show spinner in and on top of modal
      target = $(".#{modalBusyClass}")
      targetClass = modalBusyClass
      # give specific target options
      targetOptions =
        left: (target.width() / 2)
        top: (target.height() / 2)

    else if not $(".#{loadingClass}").is(':visible')
      # show spinner dead center in viewport
      $window = $(window)
      winWidth = $window.width()
      winHeight = $window.height()
      if Teseda.platform.IS_MOBILE
        # consider the negative margin on mobile because our fixed header is now unfixed
        winHeight += 60
      # ensure size of target fits exactly in viewport
      target.css
        width:"#{winWidth}px"
        height:"#{winHeight}px"
      targetOptions =
        left: (winWidth / 2) - 24
        top: (winHeight / 2)


    targetSelector = ".#{targetClass}"
    _.extend(options, targetOptions)
    toggleSpinner(targetSelector, true, options)
    $(targetSelector).removeClass('darken')
    target.show()

  api.hideAll = () ->
    $(".#{modalBusyClass}").hide()
    loadingScreen.hide()
    $(".#{loadingMsgClass}").text('')
    toggleSpinner ".#{loadingClass}", false
    toggleSpinner ".#{modalBusyClass}", false

  api.hide = () ->
    unless $rootScope.persistLoading
      api.hideAll()

  api
])
.run(["$rootScope", "LoadingService", ($rootScope, loadingService) ->

  $rootScope.$on Teseda.scope.events.site.showLoading, (e, darken) ->
    $rootScope.persistLoading = true
    loadingService.showAll()
    $(".#{loadingClass}").addClass('darken') if darken

  $rootScope.$on Teseda.scope.events.site.cancelLoading, () ->
    $rootScope.persistLoading = false
    loadingService.hideAll()

  $rootScope.$on Teseda.scope.events.site.updateLoadingMsg, (e, msg) ->
    $(".#{loadingMsgClass}").text(msg)

])
