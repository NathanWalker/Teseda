###
  RestApi
  simple wrapper for $http
###

angular.module("RestApi.config", []).value("RestApi.config", {})
angular.module("RestApi", ["RestApi.config"])
.factory("RestApiService", ["RestApi.config", "$http", (config, $http) ->

  ### PRIVATE ###
  http = (method, info) ->
    server = info.server or config.server
    suffix = info.suffix or config.suffix
    customConfig = info.config
    urlArray = info.url
    data = info.data

    # prepare base url to trim trailing slash
    url = server.slice(0, -1)

    # build the url
    _.forEach urlArray, (section) ->
      unless _.isNothing(section)
        url +="/#{section}"
    url += suffix

    if info.params
      paramKeys = _.keys(info.params)
      if paramKeys.length
        url += '?'
        _.forEach paramKeys, (key) ->
          url += "#{key}=#{info.params[key]}&"
        url = url.slice(0,url.length-1)

    # construct resource object based on api called
    switch method
      when 'get' then $http.get(url, customConfig)
      when 'save' then $http.post(url, data, customConfig)
      when 'update' then $http.put(url, data, customConfig)
      when 'delete' then $http.delete(url, customConfig)

  ### PUBLIC ###
  api = {}

  api.get = (info) ->
    http('get', info)

  api.save = (info) ->
    http('save', info)

  api.update = (info) ->
    http('update', info)

  api.delete = (info) ->
    http('delete', info)

  api
])
