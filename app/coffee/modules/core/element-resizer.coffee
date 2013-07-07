
###
  Element Resizer Service - aids responsive design
###

angular.module("ElementResizer.config", []).value "ElementResizer.config", {}
angular.module("ElementResizer", ["Logger", "ElementResizer.config"]).factory("ElementResizerService", ["LogService", "ElementResizer.config", "$rootScope", "$window", "$timeout", (log, config, $rootScope, $window, $timeout) ->
  logId = "ElementResizerService"
  api = {}

  api.venue = config.venue
  api.enabled = config.enabled

  # add unique id's to all configured targets
  _.forEach config.targets, (target) ->
    target.id = _.uniqueId()

  api.targets = config.targets

  api.register = (target) ->
    log 'please add \'id\' using _.uniqueId() to identify your target before registering!' unless target.id
    existing = _.pluck api.targets, 'id'
    unless _.contains existing, target.id
      api.targets.push target

  api.deregister = (target) ->
    existing = _.pluck api.targets, 'id'
    targetIndex = _.indexOf existing, target.id
    if targetIndex > -1
      api.targets.splice(targetIndex, 1)

  api.isRegistered = (obj) ->
    objs = _.pluck api.targets, 'obj'
    _.contains objs, obj

  api.resize = () ->
    if api.enabled
      log 'resize', logId if config.debug
      screenSize = Teseda.util.detectScreenSize()
      winWidth = screenSize.width

      _.forEach api.targets, (target) ->
        if _.isNothing(target.dontRemoveAttribute) then target.dontRemoveAttribute = false
        if _.isNothing(target.ignoreAbove) then target.ignoreAbove = 999999
        if _.isNothing(target.ignoreBelow) then target.ignoreBelow = 0
        if _.isNothing(target.staticOffset) then target.staticOffset = 0

        if target.remover
          # handle remover
          api.remover(target, winWidth)
        else
          venueWidthPercent = (winWidth - api.venue.min) / (api.venue.max - api.venue.min)
          currentSize = venueWidthPercent * (target.max - target.min) + target.min

          if target.debug
            log " ---------- element-resizer debug ----------"
            log "obj: #{target.obj}"
            log "attr: #{target.attr}"
            log "winWidth: #{winWidth}"
            log "ignoreBelow: #{target.ignoreBelow}"
            log "ignoreAbove: #{target.ignoreAbove}"
            log "min: #{target.min}"
            log "max: #{target.max}"
            log "staticOffset: #{target.staticOffset}"

          if winWidth >= target.ignoreBelow and winWidth <= target.ignoreAbove
            log "winWidth >= target.ignoreBelow and winWidth <= target.ignoreAbove: TRUE" if target.debug
            if target.min > 0 and target.max > 0
              if currentSize > target.max then size = target.max else size = currentSize
            else
              if currentSize < target.max then size = target.max else size = currentSize

            if target.staticOffset then size = size + target.staticOffset

            log "SIZE to set: #{size}" if target.debug

            if target.attr is "background-size"
              $(target.obj).css target.attr, "#{size}px " + "#{size * target.ratio}px"
            else
              $(target.obj).css target.attr, "#{size}px"
          else
            log "IGNORING ~" if target.debug
            unless target.dontRemoveAttribute
              log "dontRemoveAttribute: TRUE" if target.debug
              $(target.obj).css target.attr, ""
          return size

  api.remover = (target, winWidth) ->
    if winWidth <= target.ignoreAbove
      $(target.obj).css target.attr, ""

  api.refresh = () ->
    api.resize()

  api
]).directive("bbResize", ["LogService", "ElementResizerService", (log, resizer) ->
  link = (scope, element, attrs) ->

    unless resizer.isRegistered(attrs.bbResize)
      target =
        id: _.uniqueId()
        obj: attrs.bbResize
        attr: attrs.rAttr
        max: Number(attrs.rMax)
        min: Number(attrs.rMin)

      resizer.register target

  restrict:"A"
  link:link

]).run(["LogService", "ElementResizerService", "$window", "$timeout", "$rootScope", (log, resizer, $window, $timeout, $rootScope) ->

  if resizer.enabled

    $rootScope.$on '$viewContentLoaded', () ->
      log('$viewContentLoaded')
      resizer.refresh()

    angular.element($window).bind 'resize', () ->
      log('window resize')
      $rootScope.safeApply ->
        resizer.refresh()


])
