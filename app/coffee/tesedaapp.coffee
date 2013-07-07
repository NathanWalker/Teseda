App = window.App = angular.module("TesedaApp", ["Logger", "LoadingSpinner", "ErrorMsgs", "LocalStorage", "AppControllers", "AppDirectives", "AppServices", "AppFilters", "AppRoutes", "User", "UXTracking", "ngMobile", "ngSanitize", "ui.utils", "ui.map", "ui.select2", "ui.bootstrap", "ElementResizer", "AppCache", "Network", "AppSettings", "Modal", "Breadcrumbs", "OAuth", "StaticText", "ngTable"])

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
  .value("ElementResizer.config",
    enabled: true
    debug: false
    venue:
      max:1600
      min:320
    targets:DESIGN.targets
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
      componentSort:
        files:
          name: 'asc'
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
  $rootScope.leftbariScroll
  $rootScope.rightbariScroll

  # Menu
  $rootScope.menuEnabled = false
  $rootScope.toggleMenu = (force) ->
    $rootScope.menuEnabled = if _.isNothing(force) then not $rootScope.menuEnabled else force

  # Header
  updateNav = () ->
    # reset others
    _.forEach $rootScope.mainNav, (l) ->
      l.active = false
      return

    _.forEach $rootScope.mainNav, (l) ->
      if l.link is $location.url()
        l.active = true

  $rootScope.mainNav = [
    {
      label: 'Home'
      link: '/'
      active:false
      useCarousel:true
    },
    {
      label: 'Products'
      link: '/products'
      active: false
      useCarousel: false
      dropdown:
        options: [
          {
            label:'V550',
            link: '/products?id=V550'
          },
          {
            label:'V520',
            link: '/products?id=V520'
          }
        ]
    },
    {
      label: 'About'
      link: '/about'
      active: false
      useCarousel: false
    },
    {
      label: 'Contact'
      link: '/contact'
      active: false
      useCarousel: false
    }
  ]

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

  routeChangeFunctions = []
  $rootScope.changeRoute = (route) ->
    $rootScope.sidebarToggle(null, false)
    $location.url(route)

  $rootScope.pageNotFound = ->
    $location.url "/_404"

  $rootScope.$on "changeRoute", (e, route) ->

    # dispatched mostly from directives with isolate scopes
    $rootScope.changeRoute route

  $rootScope.$watch "leftbarActive", (val) ->
    $rootScope.rightbarActive = false
    $rootScope.barActiveSide = (if val then "left" else "")

  $rootScope.$watch "rightbarActive", (val) ->
    $rootScope.leftbarActive = false
    $rootScope.barActiveSide = (if val then "right" else "")

  $rootScope.$on Teseda.scope.events.sidebar.toggle, (e, type, force) ->
    $rootScope.sidebarToggle(type, force)

  $rootScope.sidebarToggle = (type, force) ->
    changeResult =
      type: type

    if _.isNothing(force)
      Teseda.util.hideBarScrollTo(5);
      # true toggle
      if type is "left" and $rootScope.rightbarActive
        $rootScope.rightbarActive = false
      else if type is "right" and $rootScope.leftbarActive
        $rootScope.leftbarActive = false
      # toggle accordingly
      $rootScope[type + "barActive"] = not $rootScope[type + "barActive"]
      _.extend changeResult, { enabled: $rootScope[type + "barActive"] }
    else
      $rootScope.rightbarActive = $rootScope.leftbarActive = force
      _.extend changeResult, { enabled: force }
    # notify of the sidebar change
    $rootScope.$broadcast Teseda.scope.events.sidebar.change, changeResult

  $rootScope.isSidebarActive = (type) ->
    $rootScope[type + "barActive"]

  $rootScope.sidebarActiveClass = (type) ->
    (if $rootScope[type + "barActive"] then "active" else "")

  $rootScope.pageCloseSidebar = (e) ->
    unless _.isNothing(e)
      isGrip = _.contains ['grip-leftbar', 'grip-rightbar'], $(e.target).attr('data-icon')
      if not isGrip
        $rootScope.sidebarToggle(null, false)


  $rootScope.$on "$routeChangeStart", (e, next, current) ->
    log '---- $routeChangeStart'

    $rootScope.viewPageClass = undefined
    bcService.clear() # always clear breadcrumbs

  $rootScope.$on "$routeChangeError", (event, current, previous, rejection) ->
    log "ROUTE CHANGE ERROR: " + rejection

  $rootScope.$on "$routeChangeSuccess", (event, current, previous, rejection) ->
    log '---- $routeChangeSuccess'
    ux.pageview($location.url())
    updateNav()


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
      if _.contains($location.url(), 'account') and _.contains($location.url(), 'settings')
        pClass = 'account-settings'
      else
        pClass = Teseda.util.pageClassFromRoute($location.url())
      pClass = "page-" + pClass
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
  window handling
  ###
  $($window).on 'beforeunload', () ->
    if $rootScope.uploadsInProgress
      return statictext.wraps.fileUploadsInProgress


  ###
  INIT CORE SERVICES
  Order here is important!
  ###
  settings.init()
  userService.init()

  # set active nav
  updateNav()

]
