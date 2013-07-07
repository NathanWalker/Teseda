###
ROUTER helper class
###
ROUTER = undefined
RESOLVE = undefined
(->
  lookup = {}
  otherwiseLookup = null

  nada = ->
    false

  ROUTER =
    routes:
      home_path:
        ctrl:'HomeCtrl'
        url:'/'
        view: 'site/start'

      login_path:
        ctrl:'LoginCtrl'
        url:'/login'
        view: 'site/login'

      private_browsing_path:
        ctrl:'HomeCtrl'
        url:'/private_browsing'
        view: 'site/private-browsing-notice'

      products_path:
        ctrl:'ProductsCtrl'
        url:'/products'
        view: 'site/products'

      about_path:
        ctrl:'HomeCtrl'
        url:'/about'
        view: 'site/about'

      contact_path:
        ctrl:'ContactCtrl'
        url:'/contact'
        view: 'site/contact'

      privacy_path:
        ctrl:'HomeCtrl'
        url:'/privacy'
        view:'site/privacy'

      '404_path':
        ctrl:'HomeCtrl'
        url:'/_404'
        view: 'site/404'

      '500_path':
        ctrl:'HomeCtrl'
        url:'/_500'
        view: 'site/500'

    when: (key, url, params) ->
      lookup[key] =
        url: url
        params: params

    alias: (key1, key2) ->
      lookup[key1] = lookup[key2]

    otherwise: (params) ->
      otherwiseLookup = params

    replaceUrlParams: (url, params) ->
      for k of params
        v = params[k]
        url = url.replace(":" + k, v)
      url

    routeDefined: (key) ->
      !!@getRoute(key)

    getRoute: (key, args) ->
      lookup[key]

    routePath: (key, args) ->
      url = @getRoute(key)
      url = (if url then url.url else null)
      url = @replaceUrlParams(url, args)  if url and args
      url

    install: ($routeProvider) ->
      for key of lookup
        route = lookup[key]
        url = route["url"]
        params = route["params"]
        $routeProvider.when url, params
      $routeProvider.otherwise otherwiseLookup  if otherwiseLookup
)()
