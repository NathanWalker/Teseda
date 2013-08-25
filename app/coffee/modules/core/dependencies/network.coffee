
###
  Network Service
  helps with client connectivity issues
###

angular.module("Network.config", []).value "Network.config", {}
angular.module("Network", ["Logger", "Network.config", "StaticText"]).factory("NetworkService", ["Network.config", "LogService", "$window", "$rootScope", (config, log, $window, $rootScope) ->
  logId = "NetworkService"
  events = ['clientOnline']
  api = {}
  api.clientOnline = $window.navigator.onLine
  api.events = {}

  # setup events
  _.forEach events, (event) ->
    api.events[event] = "network:#{event}"

  api.status = () ->
    log "Client is #{if api.clientOnline then "online." else "offline."}", logId
    api.clientOnline

  api.init = () ->
    w = angular.element($window)
    w.bind "online", ->
      api.clientOnline = true
      $rootScope.$broadcast api.events.clientOnline, api.clientOnline
      $rootScope.safeApply()
      api.status()

    w.bind "offline", ->
      api.clientOnline = false
      $rootScope.$broadcast api.events.clientOnline, api.clientOnline
      $rootScope.safeApply()
      api.status()

    api.status() # report status after intializing

  api
]).run(["Network.config", "NetworkService", "LogService", "$rootScope", "StaticTextService", (config, network, log, $rootScope, statictext) ->

  network.init()

  $rootScope.offlineMsg = ->
    $rootScope.alert statictext.offlineMsg

])
