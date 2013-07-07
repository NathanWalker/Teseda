
###
  UX Tracking Service
###

angular.module("UXTracking.config", []).value "UXTracking.config", {}
angular.module("UXTracking", ["Logger", "UXTracking.config"]).factory("UXTrackingService", ["LogService", "UXTracking.config", (log, config) ->

  api = {}

  api.enabled = config.enabled

  api.categories =
    NAVIGATION:'Navigation'
    USER:"Users"
    PROVIDER:"Third Party Providers"

  api.events =
    LOGGED_IN:'Logged in'
    LOGGED_OUT:'Logged out'
    LOGGED_IN_USING_PROVIDER:'Logged in with provider'
    ACCOUNT_CONNECTED_NETWORK_PROVIDER:'Account connected to a provider'
    ACCOUNT_CREATED:'Account created'
    ACCOUNT_CREATED_USING_PROVIDER:'Account created using a provider'
    NAVIGATION_HOME:'Home'
    NAVIGATION_PRODUCTS:'Products'

  api.track = (event, data) ->
    analytics.track(event, data) if api.enabled and not _.isNothing(analytics)

  api.identify = (id, data) ->
    analytics.identify(id.toString(), data) if api.enabled and not _.isNothing(analytics)

  api.pageview = (url) ->
    analytics.pageview(url)  if api.enabled and not _.isNothing(analytics)

  api
])
