angular.module("AppRoutes", ["Logger", "ngRoute"]).config ["$routeProvider", "$locationProvider", ($routeProvider, $locationProvider) ->
  $locationProvider.html5Mode(true).hashPrefix('!')

  # configuration
  prefixView = "views/"
  suffix = ".html"

  viewUrl = (view) ->
    "#{prefixView}#{view}#{suffix}"

  prep = (view, ctrl, resolve, reloadOnSearch, isDev) ->
    params = {}
    # supports direct markup ('<div></div>') or view templates ('path/to/view/file')
    isUrl = view.indexOf('<') is -1
    templateKey = if isUrl then 'templateUrl' else 'template'
    params[templateKey] = if isUrl then viewUrl(view, isDev) else view
    params.controller = ctrl
    unless _.isUndefined(resolve)
      params.resolve = resolve

    # default reloadOnSearch to false (route view change will not occur when modifying $location.search())
    params.reloadOnSearch = reloadOnSearch or false
    return params

  # ctrl names
  ctrlName = (name) ->
    "#{name}Ctrl"
  homeCtrl = ctrlName('Home')
  contactCtrl = ctrlName('Contact')
  newsCtrl = ctrlName('News')
  partnersCtrl = ctrlName('Partners')
  productsCtrl = ctrlName('Products')
  tutorialsCtrl = ctrlName('Tutorials')

  # CORE ROUTES
  $routeProvider.when('',
      prep(
        'site/home',
        homeCtrl
      )
    ).when('/',
      prep(
        'site/home',
        homeCtrl
      )
    ).when('/about',
      prep(
        'site/about',
        homeCtrl
      )
    ).when('/contact',
      prep(
        'site/contact',
        contactCtrl
      )
    ).when('/news',
      prep(
        'site/news',
        newsCtrl
      )
    ).when('/privacy',
      prep(
        'site/privacy',
        homeCtrl
      )
    ).when('/products',
      prep(
        'site/products',
        productsCtrl
      )
    ).when('/partners',
      prep(
        'site/partners',
        partnersCtrl
      )
    ).when('/tutorials',
      prep(
        'site/tutorials',
        tutorialsCtrl
      )
    ).when('/specs',
      prep(
        'site/specs',
        homeCtrl
      )
    ).when('/support',
      prep(
        'site/support',
        homeCtrl
      )
    ).when('/404',
      prep(
        'site/404',
        homeCtrl
      )
    ).when('/500',
      prep(
        'site/500',
        homeCtrl
      )
    ).otherwise(
      redirectTo: "/404"
    )
]
