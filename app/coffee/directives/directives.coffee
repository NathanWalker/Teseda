angular.module("AppDirectives", ["StaticText"]).directive("bbTargetBlank", ['$timeout', ($timeout) ->
  restrict: "A"
  link: (scope, element) ->
    scope.$evalAsync ->
      $timeout ->
        element.find("a").attr "target", "_blank"
      , 10

]).directive('tesedaMenu', ->
  link = (scope, element, attrs) ->
    scope.$watch 'menuEnabled', (val) ->
      if val
        element.css('height', '165px')
      else
        element.css('height', '0px')

  restrict: 'A'
  link: link
).directive('tesedaFaq', ->
  link = (scope, element, attrs) ->
    $(".faq input[type=text]").bind 'keyup', ->

      # text to search
      search = $(this).val().toLowerCase()

      # search if there are at least 3 characters
      if search.length > 2

        # for each question+answer in list
        $(".faq li").each ->
          question = $(this).find("h3").text()
          answer = $(this).find("p").text()
          search_in = (question + answer).toLowerCase()
          if search_in.indexOf(search) is -1

            # no match
            $(this).hide()
          else

            # match
            $(this).show()

        unless $(".faq li:visible").length
          $(".no-results").show()
        else
          $(".no-results").hide()
      else

        # show all if search box doesn't contains enough characters
        $(".faq li").show()


  restrict:"A"
  link:link
).directive('tesedaIsotope', ['$timeout', ($timeout) ->
  link = (scope, element, attrs) ->
    # container
    $container = undefined
    filter_projects = (tag) ->

      # filter projects
      $container.isotope filter: tag

      # clear active class
      $("#portfolio li.active").removeClass "active"

      # add active class to filter selector
      $("#portfolio-filter").find("[data-filter='" + tag + "']").parent().addClass "active"

      # update location hash
      # window.location.hash = tag.replace(".", "")  unless tag is "*"
      # window.location.hash = ""  if tag is "*"

    init = ->
      $container = $("#portfolio-items")
      if $container.length

        # conver data-tags to classes
        $(".project").each ->
          $this = $(this)
          tags = $this.data("tags")
          if tags
            classes = tags.split(",")
            i = classes.length - 1

            while i >= 0
              $this.addClass classes[i]
              i--


        # initialize isotope
        $container.isotope
          # options...
          itemSelector: ".project"
          layoutMode: "fitRows"


        # filter items
        $("#portfolio-filter li a").bind 'click', ->
          selector = $(this).attr("data-filter")
          filter_projects selector
          false


        # filter tags if location.has is available. e.g. http://example.com/work.html#design will filter projects within this category
        # filter_projects "." + window.location.hash.replace("#", "")  unless window.location.hash is ""

    $timeout ->
      init()
    , 400

  restrict:"A"
  link:link
]).directive("bbNav", ->
  link = (scope, element, attrs) ->

  restrict: "A"
  replace: true
  templateUrl: "views/site/nav.html"
  link: link
).directive("bbAttr", ->
  link = (scope, element, attrs) ->
    parts = attrs.bbAttr.split(':')
    attr = parts[0]
    prop = parts[1]

    scope.$watch prop, (value) ->
      if value
        element.attr "data-#{attr}", true
      else
        element.attr "data-#{attr}", false
        #element.removeAttr("data-#{attr}")

    element.removeAttr("data-bb-attr")

  restrict:"A"
  link:link
).directive("bbShare", ['LogService', '$rootScope', '$parse', 'StaticTextService', "ModalService", "ProjectService", (log, $rootScope, $parse, statictext, modal, projectService) ->
  link = (scope, element, attrs) ->

    elId = _.uniqueId('share-')
    element.attr 'id', elId
    if attrs.targetProject
      # used for nested resources that have a parent project
      if attrs.targetProject is 'shared'
        # use shared project from service
        targetProject = projectService.shared().project
      else
        parsedProject = $parse(attrs.targetProject)
        targetProject = parsedProject(scope)
      target = scope.target
    else
      # when no targetProject declared, we are actually dealing with a project (to be shared)
      target = targetProject = scope.target

    title = scope.title or statictext.share.title
    customLink = attrs.customLink

    scope.showOptions = (e) ->
      e.stopPropagation()
      if $rootScope.isCurrentLocation(['/new', '/new?provider=true', '/new?provider'])
        $rootScope.alert statictext.wraps.creationNotice
        return

      kill = scope.$on Teseda.scope.events.share.getShareTarget, () ->
        kill()
        $rootScope.$broadcast Teseda.scope.events.share.setShareTarget,
          targetProject: targetProject
          target: target
          type: scope.type
          title: title
          customLink: customLink

      modal.open('template/components/share-options.html', title)

    scope.$watch 'targetName', (value) ->
      if value
        title = "Share #{value} via ..."

    element.append("<div data-icon='share'></div>#{if scope.text then scope.text else ''}")


  restrict: "A"
  replace: true
  template: "<div class='action share' data-ng-click='showOptions($event)'></div>"
  scope:
    targetName:'=?'
    target:'='
    targetProject:'@'
    type:'@'
    title:'@'
    text:'@'
  link: link
]).directive("bbTextAreaAutoGrow", ->
  linkFn = (scope, element, attrs) ->
    element.attr "rows", 1
    element.autoGrow()

  restrict: "A"
  link: linkFn
).directive("bbClickEditText", ["LogService", (log) ->
  linkFn = (scope, element, attrs) ->
    element.attr "contenteditable", true
    modelProp = attrs.modelProp
    modelExistingProp = attrs.modelExistingProp
    targetMultiple = attrs.targetMultiple
    defaultBoldFirstLine = "<span></span>"
    clickedInto = false
    shownExisting = false
    updateModel = (value) ->
      if modelProp
        scope.model[modelProp] = value
      else
        scope.model = value

    modelVal = ->
      if modelProp
        scope.model[modelProp]
      else
        scope.model

    isModelValueBlank = (value) ->
      typeof value is "undefined" or value is "" or value is defaultBoldFirstLine or value is scope.placeholder

    resetPlaceholder = ->
      if targetMultiple
        angular.element(targetMultiple).html scope.placeholder
      else
        element.html scope.placeholder

    element.bind "click", ->
      clickedInto = true
      $this = angular.element(this)
      $this.html ""  if isModelValueBlank(modelVal()) or $this.html() is scope.placeholder

    element.bind "keydown", (e) ->
      e.stopPropagation()
      return false  if e.keyCode is 9
      $el = angular.element(e.target)
      if e.keyCode is 13
        if scope.multiline
          if scope.boldFirstLine
            currentHtml = $el.html()
            lineIndex = currentHtml.indexOf("<span>")
            if lineIndex is -1
              $el.html "<span>" + $el.text() + "</span>"
            else
              firstBreakIndex = currentHtml.indexOf("</span>") + 9
              firstLine = currentHtml.substring(0, firstBreakIndex)
              $el.html firstLine + currentHtml.substring(firstBreakIndex, $el.html().length)
            $el.focusEnd()
            log $el.html()
        else
          e.preventDefault()
          false

    element.bind "keyup", (e) ->
      $el = angular.element(e.target)
      if String.fromCharCode(e.charCode)
        if scope.multiline
          if scope.boldFirstLine
            currentHtml = $el.html()
            lineIndex = currentHtml.indexOf("<span>")
            if lineIndex is -1
              $el.html "<span>" + $el.text() + "</span>"
              $el.focusEnd()
            log $el.html()
        updateModel $el.html()
        if targetMultiple
          allOthers = _.reject(angular.element(targetMultiple), (el) ->
            el is e.target
          )
          angular.element(allOthers).html $el.html()

    element.bind "blur", (e) ->
      clickedInto = false
      $el = angular.element(this)
      resetPlaceholder()  if isModelValueBlank(modelVal()) or ($el.html() is scope.placeholder or $el.html() is "")

    init = ->
      if modelExistingProp
        existingValue = eval_("scope.model." + modelExistingProp)
        unless shownExisting
          if existingValue
            element.html existingValue
            updateModel existingValue
          else
            resetPlaceholder()
          shownExisting = true
      else resetPlaceholder()  if isModelValueBlank(modelVal())

    if scope.model
      init()
    else
      killWatcher = scope.$watch("model", (val) ->
        if val
          init()
          killWatcher()
      )

  restrict: "A"
  scope:
    id: "="
    model: "="
    placeholder: "="
    multiline: "="
    boldFirstLine: "="

  link: linkFn
]).directive("bbTimestamp", ["$rootScope", "$filter", ($rootScope, $filter) ->
  linkFn = (scope, element) ->
    isTimestampDisplayFull = ->
      tsDisplaySetting = $rootScope.AppSettings.timestampDisplay
      tsDisplaySetting is `undefined` or (tsDisplaySetting and tsDisplaySetting is "full")

    isFull = isTimestampDisplayFull()
    timestampText = (scope) ->
      $filter((if isFull then "date" else "momentAgo")) scope.bbTimestamp, Teseda.dateFormats[(if isFull then "full" else "ago")]

    element.css(
      cursor: "pointer"
      display: "inline-block"
    ).on "click", (e) ->
      e.stopPropagation()
      isFull = not isTimestampDisplayFull()
      _.forEach angular.element(".timestamp"), (el) ->
        $el = angular.element(el)
        $el.text timestampText($el.scope())

      $rootScope.AppSettings.timestampDisplay = (if isFull then "full" else "ago")
      Teseda.util.safeApply $rootScope
      false

    scope.$watch "bbTimestamp", (val) ->
      element.text timestampText(scope)  if val


  restrict: "A"
  replace: true
  scope:
    bbTimestamp: "="

  template: "<div class=\"timestamp\"></div>"
  link: linkFn
]).directive("bbInfiniteScroll", ["LogService", "$rootScope", "$timeout", (log, $rootScope, $timeout) ->
  (scope, element, attr) ->
    offset = attr.bbInfiniteScroll or 50
    id = attr.bbInfiniteScrollId or "body"
    $window = angular.element(window)
    infiniteTimeout = undefined
    $rootScope.infiniteScrollLoading = false  unless $rootScope.hasOwnProperty("infiniteScrollLoading")
    $window.bind "scroll", ->
      buffer = element.height() - offset
      if buffer > -1 and ($window.scrollTop() + $window.height()) >= buffer
        unless $rootScope.infiniteScrollLoading
          log Teseda.scope.events.infiniteScroll.needMore
          infiniteTimeoutReset()
          $rootScope.infiniteScrollLoading = true
          $rootScope.$broadcast Teseda.scope.events.infiniteScroll.needMore, id
          Teseda.util.safeApply $rootScope

    infiniteTimeoutReset = ->
      $timeout.cancel infiniteTimeout  if infiniteTimeout
      infiniteTimeout = $timeout(->
        $rootScope.infiniteScrollLoading = false
      , 1000)

    scope.$on Teseda.scope.events.infiniteScroll.loadFinished, (e) ->
      log Teseda.scope.events.infiniteScroll.loadFinished
      $rootScope.infiniteScrollLoading = false
      $timeout.cancel infiniteTimeout  if infiniteTimeout

]).directive("bbPhotoSwipe", ["$timeout", "$rootScope", ($timeout, $rootScope) ->
  link = (scope, element, attrs) ->
    photoSwipe = undefined
    options =
      enableMouseWheel: not Teseda.platform.IS_MOBILE
      enableKeyboard: not Teseda.platform.IS_MOBILE
      captionAndToolbarAutoHideDelay: 0
      backButtonHideEnabled: false

    init = () ->
      $timeout ->
        setup()
      , 200

    setup = ->
      photoSwipe = $("#" + attrs.id + " a").photoSwipe(options)
      return

    scope.$on Teseda.scope.events.photoSwipe.show, (e, index) ->
      $timeout (->
        photoSwipe.show index  if photoSwipe
      ), 350

    scope.$on Teseda.scope.events.photoSwipe.reset, ->
      # reset when needed by various controller actions abroad
      init()


    # always tear down a photo swipe instance on route change
    killListener = scope.$on "$routeChangeStart", ->
      killListener()
      $(".ps-toolbar-close").trigger "click"


    init()

  restrict: "A"
  link: link
]).directive("bbScrollTo", ["$rootScope", "ProjectService", "$window", "$location", "$timeout", ($rootScope, projectService, $window, $location, $timeout) ->
  linker = (scope, element, attrs) ->
    $timeout () ->
      if scope.$eval(attrs.ngShow)
        $($window).scrollTop(element.offset().top)
    , 200
  restrict: "A"
  link:linker
]).directive("bbAzThumbscroller", ["LogService", "$window", "$timeout", "$rootScope", "FAKE_MOBILE", "SearchService", (log, $window, $timeout, $rootScope, fakeMobile, searchService) ->
  linkFn = (scope, element, attrs) ->

    # thumbscroller doesn't work on Android due to the touch events firing poorly or not at all
    # the scroller should only appear if forcing by way of fakeMobile or is mobile and not android
    if fakeMobile or (Teseda.platform.IS_MOBILE and not Teseda.platform.IS_ANDROID)
      scrolling = false
      yOffset = undefined
      letterHeight = undefined
      selections = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "numeric"]
      targetClassPrefix = attrs.targetClassPrefix

      getDimensions = ->
        yOffset = parseInt(element.css("top"), 10)
        letterHeight = element.height() / selections.length

      touchStart = (e) ->
        e.preventDefault()
        scrolling = true
        element.addClass "active"

      touchMove = (e) ->
        e.preventDefault()

        # jQuery sometimes wraps events
        if e.originalEvent
          e = e.originalEvent

          # multi-touch sticks all simultaneous events into an array
          e = e.touches[0]  if e.touches

        letter = selections[Math.floor((e.clientY - yOffset) / letterHeight)]
        if scrolling
          element.find(".popout").removeClass("popout").end().find(".list-" + letter).addClass "popout"
          targetAnchor = $(targetClassPrefix + letter)
          if targetAnchor.length
            $($window).scrollTop($(targetClassPrefix + letter).eq(0).offset().top - 50)

      touchEnd = (e) ->
        e.preventDefault()
        scrolling = false
        element.removeClass("active").find(".popout").removeClass "popout"

      angular.element(window).on "orientationchange", ->
        getDimensions()



      $timeout ->
        getDimensions()
        element.on "touchstart", (e) ->
          touchStart e

        element.on "touchmove", (e) ->
          touchMove e

        element.on "touchend", (e) ->
          touchEnd e
      , 200

      # scope.omniSearch = searchService.omniSearch
      # scope.$watch 'omniSearch.active', (value) ->
      #   element.show() if value

      # ensure scroller is hidden when sidebar opens
      scope.$on Teseda.scope.events.sidebar.change, (e, result) ->
        # when using global search, sidebar can be open, dont hide in this case
        if result.enabled then element.hide() else element.show()

    else
      element.remove()

  restrict: "A"
  scope:
    hide: "="

  replace: true
  templateUrl: "template/components/az-scroller.html"
  link: linkFn
]).directive('scrollTopLink', ['$location', '$rootScope', ($location, $rootScope) ->
  link = (scope, element, attrs) ->
    # Click event to scroll to top
    element.bind 'click', ->
      $rootScope.safeApply ->
        $location.hash('')

      $('html, body').animate({scrollTop: 0}, 500)
      return false

  restrict: 'A'
  link: link

]).directive("nwFancyboxMedia", ["$timeout", ($timeout) ->
  link = (scope, element, attrs) ->
    element
      .fancybox
        openEffect: 'none'
        closeEffect: 'none'
        prevEffect: 'none'
        nextEffect: 'none'
        arrows: false
        helpers:
          media: {}

  restrict:'A'
  link:link
])



