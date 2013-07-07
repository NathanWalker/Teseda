
###
  Modal Service
###

angular.module("Modal.config", []).value "Modal.config", {}
angular.module("Modal", ["Logger", "Modal.config"]).factory("ModalService", ["LogService", "Modal.config", "$q", "$window", "$timeout", "$rootScope", (log, config, $q, $window, $timeout, $rootScope) ->
  logId = "ModalService"

  # maintain scroll height
  # save current page scrollTop before opening modal then reset it when closing
  # this is needed due to the css setting .container to display:none when displaying modal on certain smaller width displays
  savedPageScrollHeight = 0

  api = {}

  api.close = (canceled) ->
    defer = $q.defer()

    defer.promise.then () ->
      log 'close()', logId
      if savedPageScrollHeight
        $timeout ->
          # get back to where the viewport was at
          $($window).scrollTop(savedPageScrollHeight)
        , if Teseda.platform.IS_MOBILE then 300 else 100

      $rootScope.modalEnabled = false
      $rootScope.$broadcast Teseda.scope.events.modal.close, canceled

    # broadcast an event here to conditionally close the modal based on application specific conditions
    $rootScope.$broadcast Teseda.scope.events.modal.shouldClose, defer
    $rootScope.safeApply()


  api.open = (templateUrl, title, className) ->
    log 'open()', logId
    savedPageScrollHeight = $($window).scrollTop()
    $rootScope.modalTemplateUrl = templateUrl
    $rootScope.modalTitle = title
    $rootScope.modalEnabled = true
    $rootScope.modalClass = "modal#{if className then " #{className}" else ''}"
    $rootScope.safeApply()

  api.updateTitle = (title) ->
    $rootScope.modalTitle = title

  api
]).directive("bbModal", ->
  link = (scope, element, attrs) ->
    return;

  restrict:"A"
  replace:true
  templateUrl:'template/components/modal.html'
  link:link
).run(["$rootScope", "ModalService", ($rootScope, modal) ->

  $rootScope.modalClose = (e) ->
    e.stopPropagation() unless _.isNothing(e)
    modal.close(true)
    # always broadcast that the backdrop was clicked on
    # this helps with specific conditions that might arise when 2 modals are on screen (one above the other)
    $rootScope.$broadcast Teseda.scope.events.modal.backdropclick
])
