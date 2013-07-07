###
  Application Settings Service
  stores settings in localStorage
###

angular.module("AppSettings.config", []).value("AppSettings.config", {})
angular.module("AppSettings", ["AppSettings.config", "Logger", "LocalStorage"]).factory("AppSettingsService", ["$q", "LogService", "AppSettings.config", "$rootScope", "LocalStorageService", ($q, log, config, $rootScope, localStorageService) ->
  logId = "AppSettings"

  api = {}

  api.init = () ->
    log 'init()', logId
    localStorageService.create("AppSettings", config.defaultSettings).then (settings) ->
      lastUpdatedVersion = settings.version
      lastUpdatedVersion.isLessThan = (target) ->
        i = undefined
        len = undefined
        target = Teseda.util.parseVersion(target)  unless angular.isArray(target)
        return false  unless angular.isArray(target)
        i = 0
        len = target.length

        while i < len
          if this[i] < target[i]
            return true
          else return false  if this[i] > target[i]
          i += 1

        # identical version
        false

      # Could run migrations here
      # for now, just ensure settings are updated with latest version
      $rootScope.AppSettings.version = Teseda.prop.version  if lastUpdatedVersion.isLessThan(Teseda.prop.version)

  api
])