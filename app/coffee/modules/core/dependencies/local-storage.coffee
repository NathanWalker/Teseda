angular.module("LocalStorage.config", []).value("LocalStorage.config", {})
angular.module("LocalStorage", ["LocalStorage.config", "Logger", "ngCookies"]).factory "LocalStorageService", ["LogService", "LocalStorage.config", "$rootScope","$q", "$cookieStore", (log, config, $rootScope, $q, $cookieStore) ->

  # Uses store.js: https://github.com/marcuswestin/store.js/

  api = {}

  api.save = (key, data, cookieData) ->
    defer = $q.defer()
    usedFallback = true

    if store.enabled
      # localStorage is supported, definitely use that
      usedFallback = false
      store.set(key,data)

    if cookieData
      # if cookieData is provided, always 'also' store the data as a cookie
      # this helps if the user decides to turn private browsing on later, they will have data in a cookie
      log("creating a cookie '#{config.cookiePrefix}':")
      log(cookieData)
      $cookieStore.put(config.cookiePrefix, cookieData)

    if usedFallback
      # had to resort to fallback support storage
      log("Data was saved using fallback of cookies only!")

    # resolve back state of things
    # important to know if fallback cookie support was used
    # if store.enabled is false, then fallback was used
    defer.resolve(usedFallback)
    defer.promise

  api.get = (key, property, cookieKey) ->
    defer = $q.defer()

    localStorageData = store.get(key).property
    if localStorageData
      # always resolve with localStorage data when available
      defer.resolve(localStorageData)
    else if cookieKey
      # fallback mechanism
      # check cookie for this key
      log("checking for a cookie with this key: #{cookieKey}")
      # first get deserialized data from cookiestore
      cookieData = $cookieStore.get(config.cookiePrefix)
      if cookieData
        cookieValue = cookieData[cookieKey]
        log("value from cookie:")
        log(cookieValue)
        defer.resolve(cookieValue)
      else
        defer.resolve()
    else
      defer.resolve()

    defer.promise

  api.getAll = (key, checkCookie) ->
    defer = $q.defer()

    localStorageData = store.get(key)
    if localStorageData
      # always resolve with localStorage data when available
      defer.resolve(localStorageData)
    else if checkCookie
      # fallback mechanism
      # check cookie for this key
      # get deserialized data from cookiestore
      cookieData = $cookieStore.get(config.cookiePrefix)
      if cookieData
        log("USING COOKIES - User may be in Private Browsing Mode")
        log("cookie data:")
        log(cookieData)
        defer.resolve({cookie:cookieData})
      else
        defer.resolve()
    else
      defer.resolve()

    defer.promise

  api.reset = (key, resetCookie) ->
    defer = $q.defer()
    $rootScope[key] = undefined

    if store.enabled
      store.remove(key)

    if resetCookie
      $cookieStore.remove(config.cookiePrefix)

    defer.resolve()
    defer.promise

  # api.create = ()
  api.create = (name, defaults) ->
    defer = $q.defer()
    def = defaults
    def = {}  unless angular.isObject(def)

    # set up watcher first in case defaults are applied, they'll get saved
    $rootScope.$watch name, ((newData) ->
      api.save name, newData
      $rootScope.$broadcast "change:" + name
    ), true

    # load saved values, apply defaults and re-save
    api.getAll(name).then (allData) ->
      allData = allData or def
      _.defaults allData, def

      # Publish on $rootScope to make available to data bindings
      # Assigning value here will trigger the $watch to fire, which will cause the save
      $rootScope[name] = allData
      defer.resolve(allData)

    defer.promise
  api
]
