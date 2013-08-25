
###
  ApplicationCache Service
###

angular.module("AppCache.config", []).value "AppCache.config", {}
angular.module("AppCache", ["Logger", "AppCache.config", "StaticText"]).factory("AppCacheService", ["AppCache.config", "LogService", "$window", "$rootScope", "StaticTextService", (config, log, $window, $rootScope, statictext) ->
  logId = "AppCache"
  events = ['updateReady', 'error']

  api = {}
  api.enabled = config.enabled
  api.disablePromptOnUpdate = config.disablePromptOnUpdate
  api.events = {}

  # setup events
  _.forEach api.events, (event) ->
    api.events[event] = "appcache:#{event}"

  api.togglePromptOnUpdate = (toggle) ->
    api.disablePromptOnUpdate = toggle

  api.init = () ->
    appCache = angular.element($window.applicationCache)
    appCache.bind "updateready", (e) ->
      ac = $window.applicationCache

      if ac.status is ac.UPDATEREADY
        ac.swapCache()
        $rootScope.$broadcast api.events.updateReady
        $rootScope.safeApply()

        if api.disablePromptOnUpdate
          log "UPDATEREADY - calling window.applicationCache.swapCache()", logId
          log "An application update is available. Refresh the page to update now.", logId
        else
          $window.location.reload()  if $rootScope.confirm(statictext.appCache.updateReady)

    appCache.bind "error", (e) ->
      log "ERROR - Likely a file got renamed or moved.", logId
      $rootScope.$broadcast api.events.error
      $rootScope.safeApply()

    appCache.bind "obsolete", (e) ->
      log "OBSOLETE - calling window.applicationCache.update()", logId
      $window.applicationCache.update()

  api
]).run(["AppCache.config", "AppCacheService", "LogService", (config, appCache, log) ->

  appCache.init()

])
