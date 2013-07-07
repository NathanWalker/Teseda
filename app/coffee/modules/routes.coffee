angular.module("AppRoutes", ["Logger"]).config ["$routeProvider", "$locationProvider", ($routeProvider, $locationProvider) ->
  routingPrefix = CONFIG.routing.prefix
  $locationProvider.html5Mode true  if CONFIG.routing.html5Mode
  $locationProvider.hashPrefix routingPrefix  if routingPrefix and routingPrefix.length > 0

  # quick resolve fillers
  nope = ->
    false

  ###
  CORE ROUTES
  ###
  _.forEach Object.keys(ROUTER.routes), (key) ->
    route = ROUTER.routes[key]
    params =
      controller: route.ctrl
    templateKey = if route.view.indexOf('<') is 0 then 'template' else 'templateUrl'
    params[templateKey] = if templateKey is 'template' then route.view else CONFIG.prepareViewUrl(route.view)
    params.resolve = route.resolve if route.resolve
    ROUTER.when key, route.url, params


  ROUTER.otherwise redirectTo: "/_404"
  ROUTER.install $routeProvider
]
