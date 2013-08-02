App = window.App = angular.module("TesedaApp", ["Logger", "LoadingSpinner", "ErrorMsgs", "LocalStorage", "AppControllers", "AppDirectives", "AppServices", "AppFilters", "AppRoutes", "User", "UXTracking", "ngMobile", "ngSanitize", "ui.utils", "ui.map", "ui.select2", "ui.bootstrap", "AppCache", "Network", "AppSettings", "Modal", "Breadcrumbs", "OAuth", "StaticText", "ngTable"])

# CONSTANTS
App
  .constant("FAKE_MOBILE", false)
  .constant("GOOGLE_MAPS_ENABLED", true)

# VALUES
App
  .value("Logger.config",
    debug: Teseda.prop.debug
  )
  .value("ErrorMsgs.config",
    showMessages: true
  )
  .value("UXTracking.config",
    enabled: not Teseda.prop.debug
  )
  .value("ui.config",
    {}
  )
  .value("OAuth.config",
    providers: Teseda.thirdParties
  )
  .value("AppCache.config",
    enabled: true,
    disablePromptOnUpdate: Teseda.prop.debug
  )
  .value("AppSettings.config",
    defaultSettings:
      timestampDisplay: "full" # default timestamp display ('full' or 'ago')
      activeFilterBtns:{} # active filter btns (blend list views with different sets of meta info)
      activeToggleBtns: {} # active toggle btns
      activeSortBtns:{} # active sort btns
      version: Teseda.util.parseVersion(Teseda.prop.version)
  )

# CONFIG
App
  .config ['$compileProvider', ($compileProvider) ->
    # fix up url sanitization
    $compileProvider.urlSanitizationWhitelist(/^\s*(https?|ftp|tel|mailto|file|chrome-extension):/)
  ]

# RUN
App.run ["FAKE_MOBILE", "LogService", "UXTrackingService", "$rootScope", "$location", "$window", "$timeout", "$http", "StaticTextService", "UserService", "AppSettingsService", "ModalService", "BreadcrumbService", (fakeMobile, log, ux, $rootScope, $location, $window, $timeout, $http, statictext, userService, settings, modal, bcService) ->

  ###
  Setup certain route specific methods on $rootScope
  ###
  prefix = ""
  prefix = "#" + CONFIG.routing.prefix  unless CONFIG.routing.html5Mode

  ###
  Convenience properties
  ###
  $rootScope.platform = Teseda.platform
  $rootScope.platform.IS_MOBILE = true  if fakeMobile
  $rootScope.RequireRemoteAuthentication = false
  $rootScope.HasGeolocation = $window.navigator.geolocation and typeof $window.navigator.geolocation.getCurrentPosition is "function"
  $rootScope.UserDeniedLocation = false
  $rootScope.statictext = statictext
  $rootScope.navCollapsed = true

  # Menu
  $rootScope.menuEnabled = false
  $rootScope.toggleMenu = (force) ->
    $rootScope.menuEnabled = if _.isNothing(force) then not $rootScope.menuEnabled else force

  # Carousel
  $rootScope.carouselInterval = 6000
  $rootScope.carouselActive = () ->
    activeRoute = _.find $rootScope.mainNav, (l) ->
      l.link is $location.url()

    if activeRoute
      activeRoute.useCarousel
    else
      false

  $rootScope.carouselSlides = [
    {
      active:true
      view:'views/carousel/1.html'
    },
    {
      active:false
      view:'views/carousel/2.html'
    },
    {
      active:false
      view:'views/carousel/3.html'
    },
    {
      active:false
      view:'views/carousel/4.html'
    }
  ]

  # Footer
  $rootScope.currentYear = new Date().getFullYear()

  $rootScope.safeApply = (fn) ->
    phase = @$root.$$phase
    $rootScope.$apply(fn)  if phase isnt "$apply" and phase isnt "$digest"


  ###
  Site Navigation and Utilities
  ###
  $rootScope.isCurrentLocation = (routeArray) ->

    # checks incoming location
    _.contains routeArray, $location.url()

  $rootScope.changeRoute = (route) ->
    $location.url(route)

  $rootScope.pageNotFound = ->
    $location.url "/_404"

  $rootScope.$on "changeRoute", (e, route) ->

    # dispatched mostly from directives with isolate scopes
    $rootScope.changeRoute route


  $rootScope.$on "$routeChangeStart", (e, next, current) ->
    log '---- $routeChangeStart'
    $rootScope.navCollapsed = true

    $rootScope.viewPageClass = undefined
    bcService.clear() # always clear breadcrumbs

  $rootScope.$on "$routeChangeError", (event, current, previous, rejection) ->
    log "ROUTE CHANGE ERROR: " + rejection

  $rootScope.$on "$routeChangeSuccess", (event, current, previous, rejection) ->
    log '---- $routeChangeSuccess'
    ux.pageview($location.url())


  ###
  force a page refresh with specified route
  ###
  $rootScope.refreshPageWithRoute = (route) ->
    log "refreshPageWithRoute: " + route
    $window.location.href = route

  ###
  google maps helper
  ###
  $rootScope.initGoogleMaps = ->
    $rootScope.googleMapsReady = true
    $rootScope.$broadcast Teseda.scope.events.google.mapsReady

  ###
  window overrides
  ###
  $rootScope.alert = (msg) ->
    ($window.mockWindow or $window).alert msg

  $rootScope.confirm = (msg) ->
    ($window.mockWindow or $window).confirm msg


  ###
  <html> level page class
  @returns {string}
  ###
  $rootScope.viewPageClass = undefined
  $rootScope.pageClass = ->
    pClass = ''
    if $rootScope.viewPageClass
      pClass = "page-#{$rootScope.viewPageClass}"
    else
      pClass = "page-" + Teseda.util.pageClassFromRoute($location.url())
    return pClass + (if Teseda.platform.IS_MOBILE then ' is-mobile' else '')


  ###
  REMOTE SERVER ERROR HANDLING
  ###
  $rootScope.$on Teseda.scope.events.errors.unauthorized, (e, showMsg) ->
    $rootScope.changeRoute "/login"
    $rootScope.alert statictext.login.errorUnauthorized  if showMsg

  $rootScope.$on Teseda.scope.events.errors.internalServerError, (e) ->
    $rootScope.changeRoute "/_500"

  $rootScope.$on Teseda.scope.events.user.loginRequired, (e, showMsg) ->
    $rootScope.alert statictext.login.errorMsg  if showMsg


  ###
  INIT CORE SERVICES
  Order here is important!
  ###
  settings.init()
  #userService.init()

]
