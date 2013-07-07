###
  OAuth
  3rd party services
###

angular.module("OAuth.config", []).value("OAuth.config", {})
angular.module("OAuth", ["OAuth.config", "Logger"]).factory("OAuthService", [ "OAuth.config", "LogService", "$rootScope", "$location", "$window", "ResourceService", (config, log, $rootScope, $location, $window, rs) ->

  resourceOptions =
    type:'authorizations'

  api = {}

  api.providers = () ->
    config.providers

  api.getAuthorizedList = () ->
    rs.get(resourceOptions)

  api.authorize = (provider, authToken) ->
    # redirect to provider to obtain authorization
    $window.location.href = Teseda.uri.apiServerHost + provider.url + '?token=' + authToken + '&url=' + $location.url()

  api.deauthorize = (id) ->
    deleteOptions = _.clone(resourceOptions)
    deleteOptions.id = id
    rs.delete(deleteOptions)

  api
])
