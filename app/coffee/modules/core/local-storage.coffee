angular.module("LocalStorage", []).factory "LocalStorageService", ["$rootScope","$q", ($rootScope,$q) ->

  # Uses store.js

  api = {}
  api.privateBrowsingEnabled = false
  api.privateBrowsingMsg = "To use #{Product.name} with this device, switch Private Browsing to the 'OFF' position."
  if Teseda.platform.name is "desktop-browser"
    api.privateBrowsingMsg = "It appears you may have cookies disabled. To use #{Product.name}, please ensure cookies are enabled in your browser."
  else if Teseda.platform.IS_ANDROID
    api.privateBrowsingMsg = "To use #{Product.name} with this device, please ensure Javascript and Cookies are enabled. Additionally, ensure that your Privacy Settings are set to their default settings."

  # publish to scope for use in data bindings
  $rootScope.privateBrowsingMsg = api.privateBrowsingMsg

  valid =  () ->
    if window and window.localStorage
      ls = window.localStorage
      # in mobile safari if safe browsing is enabled, window.storage
      # is defined but setItem calls throw exceptions.
      success = true
      value = Math.random()
      try
        ls.setItem(value, value)
      catch err
        success = false
      ls.removeItem(value)
      return success

    return false

  failureHandler = () ->
    $rootScope.changeRoute('/private_browsing')


  api.save = (key, data) ->
    defer = $q.defer()
    if valid() then store.set(key,data); defer.resolve() else failureHandler(); defer.reject()
    defer.promise

  api.get = (key, property) ->
    defer = $q.defer()
    if valid() then defer.resolve(store.get(key).property) else failureHandler(); defer.reject()
    defer.promise

  api.getAll = (key) ->
    defer = $q.defer()
    if valid() then defer.resolve(store.get(key)) else failureHandler(); defer.reject()
    defer.promise

  api.reset = (key) ->
    defer = $q.defer()
    if valid() then $rootScope[key] = 'undefined'; store.remove(key);  defer.resolve() else failureHandler(); defer.reject()
    defer.promise

  # api.create = ()
  api.create = (name, defaults) ->
    defer = $q.defer()
    def = defaults
    def = {}  unless angular.isObject(def)

    if valid()
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
    else
      failureHandler()
      defer.reject()
    defer.promise
  api
]
