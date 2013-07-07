###
CONFIG helper class
###
CONFIG = undefined
(->
  viewUrlPrefix = "views/"
  viewDevelopmentUrlPrefix = "fixtures/views/"
  appVersion = "0.0.1"
  CONFIG =
    version: appVersion
    routing:
      prefix: "!"
      html5Mode: false # dynamically configured based on platform in teseda.js (search for html5Mode)
      authorizedRoutes: []

      ###
      DEVELOPMENT ROUTES
      To try out a view, add a .html file into: fixtures/views/
      Then edit app/fixtures/js/development.js, views collection with name of file

      Default View Controller: HomeCtrl
      ###
      viewsInDevelopment: (if typeof developmentJS isnt "undefined" then developmentJS.views else false)

      ###
      routes.js

      Helps with testing out data structures, etc.
      ###
      resourceRemoteUrlFor: (resource) ->
        return "fixtures/json/" + resource + ".json"  if typeof developmentJS isnt "undefined"
        return

    viewDirectory: viewUrlPrefix
    viewDevelopmentDirectory: viewDevelopmentUrlPrefix
    viewFileSuffix: ".html"
    prepareViewUrl: (url, useDevelopment, viewLocation) ->
      if useDevelopment

        # development views
        # viewLocation (optional): use if you want to test out a 'real' view in isolation (in app/views)
        @viewDevelopmentDirectory + (viewLocation or url) + @viewFileSuffix
      else
        @viewDirectory + url + @viewFileSuffix
)()