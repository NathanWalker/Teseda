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
]).directive("bbToggleCommentInput", ->
  link = (scope, element, attrs) ->
    scope.$watch "commentInputOn", (val) ->
      $commentInput = angular.element("#comment-input-area textarea")
      if val
        $commentInput.css
          width: (angular.element("#comment-input-area").width() - 100) + "px"
          height: "50px"

      else
        $commentInput.css
          width: $commentInput.css("max-width")
          height: $commentInput.css("min-height")

        Teseda.util.hideBarScrollTo 50


  restrict: "A"
  link: link
).directive("bbTextAreaAutoGrow", ->
  linkFn = (scope, element, attrs) ->
    element.attr "rows", 1
    element.autoGrow()

  restrict: "A"
  link: linkFn
).directive("bbOptionMenu", ["LogService", "$rootScope", (log, $rootScope) ->
  linkFn = (scope, element, attrs) ->
    optionMenuWidth = (width) ->
      width: ((if width then width else "auto"))
    menuPositionForScreen = (e) ->
      $target = angular.element(e.target)
      $target.closest(scope.hoverTarget).addClass "active"  if scope.hoverTarget
      needToScrollUp = (($(window).height() - e.clientY) < 300)
      if needToScrollUp
        $("html, body").animate
          scrollTop: ($target.offset().top - ($(".navbar").height() + 25))
        , 300
    scope.changeRoute = $rootScope.changeRoute
    scope.changeProjectRoute = $rootScope.changeProjectRoute
    scope.optionMenu =
      hoverTarget: attrs.hoverTarget
      enabled: false
      width: optionMenuWidth(attrs.width)
      activeWidth: optionMenuWidth(attrs.width)
      options: scope.options
      activeOptions: scope.options
      title: ""
      subOptionsEnabled: false
      customViewOption: `undefined`
      collection: attrs.collection
      scroll:
        defaults: `undefined`

      label: (option) ->
        (if _.isFunction(option.label) then option.label(scope.target) else option.label)

      showOption: (option) ->
        if option.show
          if option.showUseDependent
            option.show scope.target, scope.dependent
          else
            option.show scope.target
        else
          true

      action: (option) ->
        if scope.dependent
          option.action scope.target, scope.dependent
        else
          option.action scope.target, scope
        if option.actionCallbacks
          $callbacks = $.Callbacks()
          i = 0

          while i < option.actionCallbacks.length
            callback = option.actionCallbacks[i]
            $callbacks.add callback.fn
            if callback.args
              $callbacks.fire callback.args
            else
              $callbacks.fire()
            $callbacks.empty()
            i++
        @enabled = false

      showSubOptions: (option) ->
        @activeOptions = (if _.isString(option.subOptions.options) then scope.target[option.subOptions.options] else option.subOptions.options)
        @title = @label(option.subOptions)
        @activeWidth = optionMenuWidth(option.width)
        @customViewOption = option.subOptions.customViewOption  if option.subOptions.customViewOption
        @subOptionsEnabled = true

      back: ->
        @activeOptions = @options
        @title = ""
        @activeWidth = @width
        @customViewOption = `undefined`
        @subOptionsEnabled = false

      reset: (e) ->
        @resetAllOptionMenus()
        if e
          e.stopPropagation()
          element.hide()  if $(e.target).closest(scope.hoverTarget).length is 0  if scope.hoverTarget
        log "--- reset option menu ---"
        if @enabled
          @enabled = false
          @back()

      resetAllOptionMenus: ->
        angular.element(".option-menu").unbind "clickoutside"
        $(scope.hoverTarget).removeClass "active"  if scope.hoverTarget

      toggle: (e, indexOfOptionToPreSelect, $optionMenu) ->
        e.stopPropagation()
        thisOptionMenu = undefined
        if $optionMenu
          thisOptionMenu = $optionMenu.scope().optionMenu
        else
          thisOptionMenu = angular.element(e.target).scope().optionMenu
        unless thisOptionMenu.enabled
          thisOptionMenu.resetAllOptionMenus()
          menuPositionForScreen e
          thisOptionMenu.showSubOptions thisOptionMenu.activeOptions[indexOfOptionToPreSelect]  if indexOfOptionToPreSelect isnt `undefined`
          resetForTargetScope = (e) ->
            log e
            log "clickoutside option menu"
            $scope = angular.element(e.currentTarget).scope()
            $scope.optionMenu.reset()
            Teseda.util.safeApply $scope

          if $optionMenu
            $optionMenu.bind "clickoutside", (e) ->
              e.stopPropagation()
              resetForTargetScope e

          else
            angular.element(e.target).closest(".option-menu").bind "clickoutside", (e) ->
              e.stopPropagation()
              resetForTargetScope e

          thisOptionMenu.enabled = true
        else
          thisOptionMenu.reset()

  restrict: "A"
  replace: true
  scope:
    show: "="
    options: "="
    target: "="
    dependent: "="

  templateUrl: "template/components/option-menu.html"
  link: linkFn
]).directive("bbClickEditText", ["LogService", (log) ->
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

]).directive("bbBackgroundImage", ["$timeout", "$rootScope", ($timeout, $rootScope) ->
  link = (scope, element, attrs) ->
    loaded = false
    loadingTimer = undefined
    loadingTimerLimit = undefined
    imgWidth = undefined
    imgHeight = undefined

    cancelLoadingTimers = () ->
      $timeout.cancel(loadingTimer) if loadingTimer
      $timeout.cancel(loadingTimerLimit) if loadingTimerLimit

    addLoadingSpinner = () ->
      element.addClass 'loading-image'
      # limit the loading spinner
      # if image below fails to load after 2 seconds, hide it
      loadingTimerLimit = $timeout ->
        if not loaded
          element.removeClass 'loading-image'
          element.removeClass 'loading-failed'
      , 2000

    adjustSizeForRetina = () ->
      # use retina size where supported
      if element.css("font-family") is "pixel-ratio-2"
        imgWidth *= 2
        imgHeight *= 2

    updateImgDimensions = (width, height) ->
      imgWidth = width
      imgHeight = height

    setup = ->
      if Teseda.platform.IS_MOBILE and scope.widthMobile and scope.heightMobile
        updateImgDimensions(scope.widthMobile, scope.heightMobile)
      else if scope.width and scope.height
        # when explicit width/height is set on element
        updateImgDimensions(scope.width, scope.height)
      else
        # use the element width/height for sizing
        updateImgDimensions(element.width(), element.height())

      # adjust size for retina unless otherwise restricted
      unless scope.responsive is 'false'
        adjustSizeForRetina()

      # load image
      targetImage = document.createElement("image")
      cleanSrc = undefined
      targetImage.onload = ->
        loaded = true
        # cancel loadingTimer's now that image is loaded into the dom and ready
        cancelLoadingTimers()

        targetImage.src = ""
        element.removeClass 'loading-image'
        element.css
          "background-image": "url(" + cleanSrc + ")"

      setupSrc = (url) ->
        cleanSrc = url.replace(/\n/g, "") # cleanse any issues that may be present with a base64 data-uri is being used

        # any image that has crop controls should set 'ignoreConvert' to 'true'
        # filepicker does server-side caching on /convert urls so when trying to crop those urls, you will never get the new one back until days later
        if _.isNothing(scope.ignoreConvert) and cleanSrc.indexOf('filepicker') > -1 and cleanSrc.indexOf('convert') is -1
          # use exact dimensions to deliver optimally sized images for each display requesting the image
          parts = cleanSrc.split('?')
          fit = scope.fit or 'crop'
          cache = if scope.cache then "&cache=#{scope.cache}" else ''
          cleanSrc = "#{parts[0]}/convert?w=#{Math.floor(imgWidth)}&h=#{Math.floor(imgHeight)}&fit=#{fit}#{cache}#{if parts.length > 1 then "&#{parts[1]}" else ""}"

        # cause image to load into DOM
        targetImage.src = cleanSrc

        # start loadingTimer: show spinner if img is not loaded within 300 ms
        # helps prevent so many loading spinners on screen everytime an image needs to be displayed
        loadingTimer = $timeout ->
          addLoadingSpinner()
        , 500

      unless _.isNothing(scope.bbBackgroundImage)
        if _.isString(scope.bbBackgroundImage)
          setupSrc(scope.bbBackgroundImage)
        else if scope.bbBackgroundImage.exp
          # TODO: check expiration, re-sign if needed
          setupSrc(scope.bbBackgroundImage.url)


    scope.$watch "bbBackgroundImage", (url) ->
      if url
        setup()
      else
        # clearing an image (editing)
        element.css("background-image": "")
    , true

  restrict: "A"
  scope:
    bbBackgroundImage: "="
    width:"@"
    height:"@"
    widthMobile:"@"
    heightMobile:"@"
    ignoreConvert:"@"
    responsive:"@"
    cache:"@"
    fit:"@"
  link: link
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
]).directive("bbSwipe", ["$timeout",  ($timeout) ->
  linkFn = (scope, element, attrs) ->

    swiper = undefined

    # assign a unique id
    element.attr 'id', _.uniqueId()

    scope.swipeNext = (e) ->
      e.stopPropagation();
      swiper.next() unless _.isNothing(swiper)

    scope.swipePrev = (e) ->
      e.stopPropagation();
      swiper.prev() unless _.isNothing(swiper)


    totalSlides = attrs.explicitTotal or element.find(".swipe-frame").length # total number of slides
    startSlide = attrs.startSlide or 0
    dotsPosition = attrs.dotsPosition
    emitEvents = attrs.emitEvents is "true"
    moveTarget = attrs.moveTarget
    moveProperty = attrs.moveProperty
    moveSpeed = (if attrs.moveSpeed then parseInt(attrs.moveSpeed) else 3) # default speed is 3
    isSwiping = false
    fadeLast = attrs.fadeLast # fadeLast value is selector of element to fade
    $swipeControls = undefined
    $dotsContainer = undefined
    if dotsPosition

      # opted to use dots
      $swipeControls = $("<div class=\"swipe-controls\"><div class=\"dots-container\"></div></div>")
      $dotsContainer = $swipeControls.find("div.dots-container")
      totalDots = (if fadeLast then (totalSlides - 1) else totalSlides)
      i = 0

      while i < totalDots
        $dot = $("<a href=\"javascript:void(0)\" class=\"dot\"><span class=\"dot-bkd iconfont\">x<span class=\"dot-fill\">y</span></span></a>")
        $dot.addClass "active"  if i is startSlide
        $dotsContainer.append $dot
        i++
      if dotsPosition is "top"
        $swipeControls.insertBefore element
      else if dotsPosition is "bottom"
        $swipeControls.insertAfter element
      else if dotsPosition is "overlay"
        element.append $swipeControls

    $timeout ->
      configSettings = callback: (event, index, elem) ->

        # runs at the end of any slide change
        elId = $(elem).attr("data-id")
        elId = (if elId then parseInt(elId) else 0)
        if emitEvents
          scope.$emit "swipe",
            id: elId
            swipeIndex: index

        if $swipeControls
          $swipeControls.find("a").removeClass "active" # reset
          $swipeControls.find("a").eq(index).addClass "active"

      if startSlide > 0
        _.extend configSettings,
          startSlide: startSlide

      if moveTarget
        _.extend configSettings,
          dispatchEvents: true

      swiper = new Swipe(document.getElementById(element.attr('id')), configSettings)

      if moveTarget

        # move target was specified
        moveTarget = $(moveTarget) # use jquery - need animate
        fadeLast = $(fadeLast)  if fadeLast
        startPosition = parseInt(moveTarget.css(moveProperty))
        swiper.on "SWIPING", (pos) ->
          isSwiping = true
          inverse = pos.translate3d < 0 or pos.translate3d > startPosition
          adjustedPos = (pos.translate3d / moveSpeed) * ((if inverse then 1 else -1))
          if inverse
            adjustedPos += startPosition
          else
            adjustedPos -= startPosition
          moveTarget.css moveProperty, adjustedPos + "px"
          onLastVisibleSlide = (pos.index + 1 is totalSlides - 1)
          if fadeLast and onLastVisibleSlide and pos.deltaX < 0
            positiveDelta = (if pos.deltaX < 0 then pos.deltaX * -1 else pos.deltaX)
            opacityLevel = (100 - positiveDelta) / 100
            fadeLast.css "opacity", opacityLevel

        swiper.on "SLIDE", (pos) ->
          inverse = pos.translate3d < 0 or pos.translate3d > startPosition
          adjustedPos = (pos.translate3d / moveSpeed) * ((if inverse then 1 else -1))
          if inverse
            adjustedPos += startPosition
          else
            adjustedPos -= startPosition
          animateProp = {}
          animateProp[moveProperty] = adjustedPos + "px"
          moveTarget.animate animateProp, 300
          isSwiping = false
          if fadeLast
            onLastVisibleSlide = (pos.index + 1 is totalSlides - 1)
            if onLastVisibleSlide
              fadeLast.animate
                opacity: 1
              , 300
            else scope.$emit "swipe:remove"  if pos.index + 1 is totalSlides

      if attrs.clickToSwipe

        # click containers to advance swipe
        element.find("li.swipe-content").on "click", ->
          swiper.next()  unless isSwiping

      if $swipeControls
        $swipeControls.find("a:not(.swipe-hint)").bind "click", ->
          $swipeControls.find("a").removeClass "active" # reset
          $(this).addClass "active"
          swiper.slide $swipeControls.find("a").index($(this))

    , 0

    scope.$watch 'bbSwipe', (value) ->
      if value and value.length > 1
        element.find('.nav').show()
      else
        element.find('.nav').hide()


  restrict: "A"
  scope:{
    bbSwipe:'='
  }
  link: linkFn
]).directive("bbEditField", ["$rootScope", "StaticTextService", ($rootScope, statictext) ->
  link = (scope, element, attrs) ->
    modelName = attrs.model
    modelProp = attrs.modelProp

    # sometimes remote apis will set a default value, you can specify that here
    # helps when you want to show placeholder regardless if a default value is given
    defaultBlankValue = (if attrs.staticTextKey then statictext[attrs.staticTextKey] else "")
    type = attrs.type
    autocorrect = attrs.autocorrect
    autocapitalize = attrs.autocapitalize
    maxlength = attrs.maxlength
    isDisabled = attrs.disabled
    disabledMsg = scope.disabledMsg
    parentScope = attrs.parentScope is "true"
    switch type
      when "text"
        element.append "<input placeholder=\"" + scope.placeholder + "\" type=\"text\" autocorrect=\"" + ((if autocorrect then autocorrect else "off")) + "\" autocapitalize=\"" + ((if autocapitalize then autocapitalize else "off")) + "\"" + ((if maxlength then " maxlength=\"" + maxlength + "\"" else "")) + "/>"
      when "textarea"
        element.append "<textarea placeholder=\"" + scope.placeholder + "\" type=\"text\" autocorrect=\"" + ((if autocorrect then autocorrect else "off")) + "\" autocapitalize=\"" + ((if autocapitalize then autocapitalize else "off")) + "\"" + ((if maxlength then " maxlength=\"" + maxlength + "\"" else "")) + "></textarea>"
    $field = element.find("input, textarea")
    $placeholder = undefined
    $remove = undefined
    updateModel = (value) ->
      if modelProp
        scope.model[modelProp] = value
      else
        scope.model = value

    placeholderValue = ->
      scope.placeholderMarketing or scope.placeholder

    $field.on "focus", (e) ->
      if isDisabled
        e.preventDefault()
        e.stopPropagation()
        $field.trigger "blur"
        $rootScope.alert disabledMsg  if disabledMsg
        return false
      $field.css "opacity", 1
      $placeholder.hide()
      $field.addClass "editing"
      $remove.show()  if $remove
      element.removeClass "dotted"  if scope.removable

    $field.on "blur", (e) ->
      if $field.val() is ""
        $field.css "opacity", 0
        $placeholder.show()
        $field.removeClass "editing"
        $field.css # when textarea, user can resize which adds height inline, remove it
          height: ""
          width: ""

        $remove.hide()  if $remove
        element.addClass "dotted"  if scope.removable
      else
        $placeholder.hide()

    $field.on "keyup", (e) ->
      updateModel $field.val()

    element.append "<span class=\"input-placeholder\">" + placeholderValue() + "</span>"
    $placeholder = element.find(".input-placeholder")
    if scope.removable
      element.addClass "dotted"
      unless isDisabled
        iconStyle = ""# "icon-white"
        element.append "<a class=\"icon-remove-circle " + iconStyle + "\"></a>"
        $remove = element.find(".icon-remove-circle")
        $remove.on "click", ->
          $field.val ""
          $field.trigger "blur"
          updateModel ""

    init = ->
      initialValue = scope.model[modelProp]
      if initialValue is defaultBlankValue or not initialValue? or initialValue is "" or typeof initialValue is "undefined"
        updateModel "" # ensure value is actually blanked out (given case of defaultBlankValue being set)
        $field.css "opacity", 0
        $remove.hide()  if $remove
      else
        $field.val initialValue
        $field.addClass "editing"
        $field.css "opacity", 1
        $placeholder.hide()

    if scope.model
      init()
    else
      scope = (if parentScope then scope.$parent else scope)
      killWatcher = scope.$watch(modelName, (value) ->
        if value
          scope.model = value
          init()
          killWatcher()
      )

  restrict: "A"
  replace: true
  scope:
    model: "="
    placeholder: "="
    placeholderMarketing: "="
    disabledMsg: "="
    removable: "="
  template: "<div class=\"field-container\"><div class=\"dimmer\"></div></div>"
  link: link
]).directive("bbEditContactFields", ["$rootScope", "$timeout", "ProjectService", ($rootScope, $timeout, projectService) ->
  link = (scope, element, attrs) ->
    excludeLabels = if attrs.excludeLabels then excludeLabels.split(",")
    onlyLabels = if attrs.onlyLabels then attrs.onlyLabels.split(",")

    placeholderValue = ->
      scope.placeholderMarketing or scope.placeholder

    init = ->
      scope.model = scope.model or {}
      scope.model.contacts = [] if _.isUndefined(scope.model.contacts)
      $selectContactArea = element.find(".select-contact-field")
      $addMoreContactSelect = $selectContactArea.find("select")
      #$selectContactArea.append "<span class=\"input-placeholder\">" + placeholderValue() + "</span>"
      #$placeholder = $selectContactArea.find(".input-placeholder")
      if excludeLabels
        scope.contactOptionLabels = _.reject projectService.contactOptions.labels, (l) ->
          _.contains(excludeLabels, l.label)
      else if onlyLabels
        scope.contactOptionLabels = _.where projectService.contactOptions.labels, (l) ->
          _.contains(onlyLabels, l.label)
      else
        scope.contactOptionLabels = projectService.contactOptions.labels

      scope.addMoreContacts = ""

      scope.changeAdditional = (e, contact) ->
        $el = angular.element(e.target)
        addressType = $el.attr("data-address")
        if addressType

          # special address handling
          updateModel $el.val(), addressType
        else

          # standard contact field
          updateModel $el.val(), "contact" + contact.id

      scope.modifyContactType = (e, contact) ->
        $el = angular.element(e.target)
        unless $el.val() is ""
          contact.defaultType = $el.val()

      addAddress = (label, address) ->
        newAddress =
          _.extend(
            id: _.uniqueId()
            title: if address then address.title else ""
            address: if address then address.address else ""
            city: if address then address.city else ""
            state: if address then address.state else ""
            zip: if address then address.zip else ""
          , _.clone(label, true))
        scope.model.contacts.push(newAddress)

      addContact = (label, contact) ->
        newContact = _.extend( # clone it - we don't want to modify our global constants!
          id: _.uniqueId()
        , _.clone(label, true))
        scope.model.contacts.push(newContact)

      scope.addContactOption = (e) ->
        $select = angular.element(e.target)
        unless $select.val() is ""
          contactLabel = _.find(projectService.contactOptions.labels, (opt) ->
            opt.label is $select.val()
          )
          if contactLabel.label is "Address"
            # add an address
            addAddress(contactLabel)
          else
            addContact(contactLabel)

          $selectContactArea.addClass "added dotted"
          #$placeholder.html "Add another contact..."

      scope.removeAdditionalContact = (e, contact) ->
        e.stopPropagation()
        contactIndex = _.indexOf(_.pluck(scope.model.contacts, "id"), contact.id)

        # update scope and other settings
        scope.model.removedContacts = [] if _.isNothing(scope.model.removedContacts)
        scope.model.removedContacts.push(contact)
        scope.model.contacts.splice contactIndex, 1

        if scope.model.contacts.length is 0

          # reset placeholder
          $selectContactArea.removeClass "added dotted"
          selectBlur()
          #$placeholder.html placeholderValue()
        $timeout ->
          Teseda.util.safeApply(scope) # wrapping in timeout helps keep scope and manual dom changes in sync
        , 50

      scope.resetOnBlur = (e) ->
        $select = angular.element(e.target)
        scope.addMoreContacts = ""
        $select.val "" # because angular's select tags are annoying

      selectBlur = ->
        if scope.model.contacts.length is 0
          #$placeholder.show()
          element.addClass "dotted"


      # TODO: check existing model - this works for editing models as well
      hasExistingContacts = false

      if hasExistingContacts
        $selectContactArea.addClass "added dotted"
        #$placeholder.html "Add another contact..."
      else
        # show default setup
        element.addClass "dotted"
        $addMoreContactSelect.on "focus", ->
          element.removeClass "dotted"

        $addMoreContactSelect.on "blur", selectBlur

      if onlyLabels and _.first(onlyLabels) is "Address"
        # add the address input and hide the multi-add select element
        $addMoreContactSelect.remove()
        unless scope.model.name
          addrLabel =
            label:"Address"
            types: Teseda.contacts.defaultTypes()
            defaultType: Teseda.contacts.address.defaultType
          addAddress(addrLabel)

    init()

  restrict: "A"
  replace: true
  scope:
    model: "="
    limit: "=?"
    placeholder: "="
    placeholderMarketing: "="
  templateUrl: "template/components/project/bb-edit-contact-fields.html"
  link: link
]).directive("bbPrettyText", ['$filter', ($filter) ->
  link = (scope, element, attrs) ->
    updateText = () ->
      element.html(linkify($filter('breakToBr')(scope.text)))
      # all links should be target blank
      element.find("a").attr("target", "_blank")

    scope.$watch 'text', (value) ->
      updateText()

  restrict:"A"
  scope:
    text:'=bbPrettyText'
  link:link

]).directive("bbGridFooterBar", ["$compile", "$http", ($compile, $http) ->
  # DEPENDANT ON CTRL SCOPE HAVING 'gridOptions' DEFINED
  ngGridFooter =
    scope: false
    compile: ->
      pre: ($scope, iElement, iAttrs) ->
        $http.get("template/components/grid/control-bar.html").success (template) ->
          iElement.append $compile(template)($scope.$parent.$parent.gridOptions.$gridScope)  if iElement.children().length is 0

  ngGridFooter
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

])



