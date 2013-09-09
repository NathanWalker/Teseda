Teseda =
  name: "Teseda"
  defaults:{}
  prop:
    docReadyTime: 0
    clientOnline: true
    userHasBeenPromptedToShareLocation: false
    isFullscreen: navigator.hasOwnProperty and navigator.hasOwnProperty("standalone") and navigator.standalone
    debug: location.hostname.indexOf("teseda") is -1
    maxThumbnailPreviewSize: 5 * 1024 * 1024
    version: ""
    webWorkersAvailable: window and window.Worker
    supportedTypes:
      images: ["image/jpeg", "image/png", "image/gif"]
    transparent: "img/vendor/transparent.gif"

  sortOrder:
    types: ['asc', 'desc']

  localStorage:
    keyNames:
      currentUser: "currentUser"

  scope:
    events:
      errors:
        unauthorized: "401"
        internalServerError: "500"

      user:
        refresh: "user:refresh"
        refreshSuccess: "user:refresh:success"
        authenticatedYes: "user:authenticated:yes"
        authenticatedNo: "user:authenticated:no"
        loginRequired: "user:loginRequired"
        createNew: "user:createNew"

      infiniteScroll:
        needMore: "infiniteScroll:needMore"
        loadFinished: "infiniteScroll:loadFinished"

      photoSwipe:
        reset: "photoSwipe:reset"
        show: "photoSwipe:show"

      google:
        mapsReady: "google:mapsReady"

      sidebar:
        change:"sidebar:change"
        toggleLeft: "sidebar:toggle:left"
        toggleRight: "sidebar:toggle:right"

      modal:
        close: "modal:close"

      breadcrumbs:
        update:"breadcrumbs:update"

      site:
        showLoading:"site:showLoading"
        cancelLoading: "site:cancelLoading"
        updateLoadingMsg: "site:updateLoadingMsg"
        rootViewReady:"site:rootViewReady"
        imageCropped:"site:imageCropped"

  platform:
    IS_MOBILE: false
    IS_ANDROID: false
    IS_IOS: false
    IS_IPHONE: false
    IS_IPAD: false
    IS_OTHER: false
    IS_LEGACY_IE: false
    IS_LEGACY_ANDROID: false
    IS_LEGACY_IOS: false
    version: [0]

  regex:
    isoDateTime: /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/
    urlHostAndPath: /^([^:]+:\/\/\w+:?\w*@?[\w\.-]*(?::[0-9]+)?)(\/.*)/
    email: /^[A-z0-9._%-]+@[A-z0-9._%-]+\.[A-z]{2,4}$/
    phone: /^(?:1[-. ]?)?\s?\(?[0-9]{3}\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}(?:\s?[xX]\s?[0-9]{1,8})?$/

  uri:
    host: location.protocol + "//" + location.hostname
    apiRoot: "/v1/"
    frontendPort: 8000
    backendPort: 3000
    testingPorts: [9201, 9202, 9203, 8100]
    server: ""
    apiServerHost: ""
    apiServer: ""

  thirdParties:

    google_oauth2:
      label: "Google"
      name: "google"
      url: "/auth/google_oauth2/start"
      order: 1

    linkedin:
      label: "LinkedIn"
      name: "linkedin"
      url: "/auth/linkedin/start"
      order: 2

    twitter:
      label: "Twitter"
      name: "twitter"
      url: "/auth/twitter/start"
      order: 3

    facebook:
      label: "Facebook"
      name: "facebook"
      url: "/auth/facebook/start"
      order: 4

  dateFormats:
    full: "EEEE, MMM d, y @ h:mm a"
    short: "MM/dd/yy h:mm a"
    ago: "YYYYMMDDThhmmssZ"

  util:
    randomCharacters: (maxlength) ->
      chars = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghiJklmnopqrstuvwxyz", "0123456789", "!@#$%^&*()-_=+,.<>/?;:[]{}~"]
      charGroups = [1, 1, 1, 1]
      randomChars = []
      charCount = 0
      numCount = 0
      rnum = undefined
      floor = Math.floor
      random = Math.random
      i = undefined
      j = undefined
      temp = undefined
      i = 0
      while i < (maxlength - charGroups.length)
        charGroups[floor(random() * chars.length)]++
        i++
      _.forEach charGroups, (count, index) ->
        while count--
          rnum = floor(random() * chars[index].length)
          randomChars.push chars[index].substr(rnum, 1)

      i = randomChars.length
      while --i
        j = floor(random() * (i + 1))
        temp = randomChars[i]
        randomChars[i] = randomChars[j]
        randomChars[j] = temp
      randomChars.slice(0, maxlength).join ""

    earthDistance: (lat1, lon1, lat2, lon2) ->
      earthRadius = 6371000
      PI = Math.PI
      acos = Math.acos
      cos = Math.cos
      sin = Math.sin
      lat1 = lat1 * (PI / 180)
      lat2 = lat2 * (PI / 180)
      lon1 = lon1 * (PI / 180)
      lon2 = lon2 * (PI / 180)
      acos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon2 - lon1)) * earthRadius

    safeApply: (s) ->
      phase = s.$root.$$phase
      s.$apply()  if phase isnt "$apply" and phase isnt "$digest"

    imageUrlCleaner: (url) ->
      if url and Teseda.prop.debug and window.location.hostname.indexOf("localhost") is -1
        url.replace /localhost/, window.location.hostname
      else
        url

    allowZoom: (flag) ->
      if flag is true
        angular.element("head meta[name=viewport]").remove()
        angular.element("head").prepend "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=10.0, minimum-scale=1, user-scalable=1\" />"
      else
        angular.element("head meta[name=viewport]").remove()
        angular.element("head").prepend "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0\" />"

    routeCleaner: (route) ->
      route = route.toString()
      route = "/" + route  if route isnt "" and route.indexOf("/") isnt 0
      route

    pageClassFromRoute: (route) ->
      if route
        route = route.substring(1, route.length)  if route.indexOf("/") is 0
        pageName = route.split("/").join("-").split("?")[0]
        (if pageName is "" then "home" else pageName)
      else
        ""

    detectScreenSize: ->
      w = 0
      h = 0
      screenSize = {}
      if Teseda.platform.IS_MOBILE and Teseda.platform.IS_ANDROID
        if Teseda.platform.IS_LEGACY_ANDROID
          w = document.width
          h = document.height

      if _.isNothing(w) or _.isNothing(h)
        w = $(window).outerWidth(true)
        h = $(window).outerHeight(true)
      screenSize.height = h
      screenSize.width = w
      screenSize

    disableTouchMove: (e) ->
      e.preventDefault()  if e

    isImageType: (type) ->
      type.search(/image\/(gif|jpeg|png|tiff)/) > -1

    parseVersion: (version, splitChar) ->
      splitChar = splitChar or "."
      (if (typeof version is "string" and version.length > 0) then version.split(splitChar) else [0])

    stripHTML: (html) ->
      (html or "").replace("<br>", "\n").replace("<br/>", "\n").replace("<br />", "\n").replace /<\/?[a-z][a-z0-9]*[^<>]*>/g, ""

    toggleSpinner: (targetSelector, on_, options) ->
      if on_ and $(targetSelector + " .spinjs").length is 0
        $(targetSelector).spin $.extend(
          className: "spinjs"
          color: "#fff"
        , options)
      else $(targetSelector).spin false  if on_ is false

    hideBarScrollTo: (timeoutDelay, scrollToPosition) ->
      setTimeout (->
        window.scrollTo 0, (if scrollToPosition then scrollToPosition else Teseda.platform.scrollTop)
      ), timeoutDelay

# setup convenient defaults
Teseda.defaults.sortOrder = _.first(Teseda.sortOrder.types)
Teseda.prop.version = Teseda.util.parseVersion(CONFIG.version)
Teseda.uri.server = Teseda.uri.host + ((if window.location.port then ":" + window.location.port else ""))
if Teseda.uri.host is "https://staging.teseda.com"
  Teseda.uri.apiServerHost = "https://api-staging.teseda.com"
else if Teseda.uri.host is "https://www.teseda.com"
  Teseda.uri.apiServerHost = "https://api.teseda.com"
else
  Teseda.uri.apiServerHost = Teseda.uri.host + ((if window.location.port then ":" + Teseda.uri.backendPort else ""))
Teseda.uri.apiServer = Teseda.uri.apiServerHost + Teseda.uri.apiRoot
portNumber = parseInt(window.location.port, 10)
Teseda.prop.debug = _.contains(Teseda.uri.host, "localhost") and not _.contains(Teseda.uri.testingPorts, portNumber)
_.mixin
  capitalize: (string) ->
    string.charAt(0).toUpperCase() + string.slice(1)

  pluralize: (string) ->
    string + "s"

  isNothing: (value) ->
    _.isUndefined(value) or _.isNaN(value) or _.isNull(value) or value is 0

  move: (array, old_index, new_index) ->
    if new_index >= array.length
      k = new_index - array.length
      array.push `undefined`  while (k--) + 1
    array.splice new_index, 0, array.splice(old_index, 1)[0]

(->
  ua = navigator.userAgent.toLowerCase()
  newSettings = {}
  parseVersion = Teseda.util.parseVersion
  isFullscreen = Teseda.prop.isFullscreen
  ieVersion = (->
    undef = undefined
    v = 3
    div = document.createElement("div")
    all = div.getElementsByTagName("i")
    while all[0]
      div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->"


    return if v > 4 then v else undef
  )()
  if ua.match(/android/i)
    newSettings =
      IS_MOBILE: true
      IS_ANDROID: true
      name: "android"
      version: parseVersion(ua.match(/android ([\d\.]+)/)[1], ".")
      scrollTop: 1
      addressBarHeight: 57
      prevOrientation: window.orientation
  else if ua.match(/ipad/i)
    newSettings =
      IS_MOBILE: true
      IS_IOS: true
      IS_IPAD: true
      name: "ipad"
      version: parseVersion(ua.match(/cpu os ([\d_]+)/)[1], "_")
      scrollTop: 1
      addressBarHeight: (if isFullscreen then 0 else 60)
  else if ua.match(/iphone|ipod/i)
    newSettings =
      IS_MOBILE: true
      IS_IOS: true
      IS_IPHONE: true
      name: "iphone"
      version: parseVersion(ua.match(/cpu iphone os ([\d_]+)/)[1], "_")
      scrollTop: 1
      addressBarHeight: (if isFullscreen then 0 else 60)
  else if ua.match(/mobile|blackBerry|iemobile|kindle|netfront|silk-accelerated|(hpw|web)os|fennec|minimo|opera m(obi|ini)|blazer|dolfin|dolphin|skyfire|zune|windows\sce|palm/i)
    newSettings =
      IS_MOBILE: true
      IS_OTHER: true
      name: "mobile-generic"
      scrollTop: 0
      addressBarHeight: 0
  else
    newSettings =
      IS_OTHER: true
      name: "desktop-browser"
  newSettings.IS_LEGACY_IE = ieVersion < 10
  newSettings.IS_LEGACY_ANDROID = newSettings.IS_ANDROID and newSettings.version[0] < 4
  newSettings.IS_LEGACY_IOS = newSettings.IS_IOS and newSettings.version[0] < 6
  _.extend Teseda.platform, newSettings
)()

#  Make the :contains selector case-insensitive
jQuery.expr[":"].contains = (a, i, m) ->
  jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0


#! extend spin for jquery ease
jQuery.fn.spin = (opts) ->
  @each ->
    $this = $(this)
    data = $this.data()
    if data.spinner
      data.spinner.stop()
      delete data.spinner
    data.spinner = new Spinner(opts).spin(this)  if opts isnt false

  this


# outerHTML
jQuery.fn.outerHTML = ->
  $("<div>").append(@eq(0).clone()).html()

jQuery.fn.focusEnd = ->
  $(this).focus()
  tmp = $("<span />").appendTo($(this))
  node = tmp.get(0)
  range = null
  sel = null
  if document.selection
    range = document.body.createTextRange()
    range.moveToElementText node
    range.select()
  else if window.getSelection
    range = document.createRange()
    range.selectNode node
    sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange range
  tmp.remove()
  this


#
# * Auto-growing textareas
#
jQuery.fn.autoGrow = ->
  @each ->

    # Variables
    colsDefault = @cols
    rowsDefault = @rows

    #Functions
    grow = ->
      growByRef this

    growByRef = (obj) ->
      linesCount = 0
      lines = obj.value.split("\n")
      i = lines.length - 1

      while i >= 0
        linesCount += Math.floor((lines[i].length / colsDefault) + 1)
        --i
      if linesCount > rowsDefault
        obj.rows = linesCount + 1
      else
        obj.rows = rowsDefault

    characterWidth = (obj) ->
      characterWidth = 0
      temp1 = 0
      temp2 = 0
      tempCols = obj.cols
      obj.cols = 1
      temp1 = obj.offsetWidth
      obj.cols = 2
      temp2 = obj.offsetWidth
      characterWidth = temp2 - temp1
      obj.cols = tempCols
      characterWidth


    # Manipulations
    #this.style.width = "auto";
    @style.height = "auto"
    @style.overflow = "hidden"
    @style.width = ((characterWidth(this) * @cols) + 6) + "px"
    @onkeyup = grow
    @onfocus = grow
    @onblur = grow
    growByRef this



###
Object extensions
###

# from JavaScript: The Good Parts
if typeof Object.create isnt "function"
  Object.create = (o) ->
    F = ->

    F:: = o
    new F()

# for escaping strings passed into RegExp(), from prototype.js
if typeof RegExp.escape isnt "function"
  RegExp.escape = (str) ->
    (str + "").replace /([.*+?^=!:${}()|[\]\/\\])/g, "\\$1"

###
Read more extension
@param textLimit (limit to truncate text to)
@param targetScrollToSelector (the selector of the container in which the view should scroll to when toggling read more link)
NOTE: This is needed because of the usage of AngularJS sanitize module and how ng-bind-html works
###
String::readMore = (textLimit, targetScrollToSelector) ->
  strippedText = Teseda.util.stripHTML(this)
  filteredText = ""
  if strippedText.length > textLimit

    # container to scroll to when toggling read more link
    # IMPORTANT: Must use attribute 'rel' here (instead of 'data') because angular's ng-bind-html directive strips data attributes
    readMoreTarget = ((if targetScrollToSelector then " rel=\"" + targetScrollToSelector + "\"" else ""))
    filteredText = "<span class=\"read-more\">" + this + "<br/><br/><a class=\"read-more-or-less-link\"" + readMoreTarget + ">Read less</a></span>"
    filteredText += "<span class=\"read-less\">" + linkify(strippedText.substr(0, textLimit).split(/\r\n|\r|\n/).join(" <br/><br/>")) + "... <a class=\"read-more-or-less-link\"" + readMoreTarget + ">Read more</a></span>"
  else
    filteredText = "<span>" + this + "</span>"
  filteredText

if typeof String::trimLeft isnt "function"
  String::trimLeft = ->
    @replace /^\s\s*/, ""
if typeof String::trimRight isnt "function"
  String::trimRight = ->
    @replace /\s\s*$/, ""
if typeof String::trim isnt "function"
  String::trim = ->
    @trimLeft().trimRight()
$(document).ready ->

  # helps aid specialized behavior in various views
  Teseda.prop.docReadyTime = new Date().getTime()
