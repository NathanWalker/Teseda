AppServices = window.AppServices = angular.module 'AppServices', []

AppServices.factory('CrudCtrlService', ['LogService', '$rootScope', '$location', (log, $rootScope, $location) ->
  ###
    CRUD View Initialization
  ###
  api =
    init: (s, logId, viewFolder, supportedPages, resource, page) ->
      log "init()#{ if resource then ' for id: ' + resource.id else ''}", logId
      authPages = ['edit']
      isNew = _.last $location.path().split('/') is 'new'

      if resource
        if page
          if supportedPages and _.contains supportedPages, page
            if _.contains(authPages, page) and not $rootScope.isAuthenticated
              log "page required authentication!"
              $rootScope.$broadcast Teseda.scope.events.errors.unauthorized
              return

            s.templateUrl = "#{CONFIG.viewDirectory}#{viewFolder}/#{page}.html"
          else
            # page not found
            log "appears to not support page: #{page}", logId
            $rootScope.pageNotFound()
        else
          # show
          s.templateUrl = "#{CONFIG.viewDirectory}#{viewFolder}/show.html"
      else if isNew
        # new
        s.templateUrl = "#{CONFIG.viewDirectory}#{viewFolder}/new.html"
      else
        # index
        s.templateUrl = "#{CONFIG.viewDirectory}#{viewFolder}/index.html"

  return api
])
