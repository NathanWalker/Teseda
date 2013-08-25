###
  Breadcrumbs
###

angular.module("Breadcrumbs.config", []).value "Breadcrumbs.config", {}
angular.module("Breadcrumbs", ["Breadcrumbs.config", "Logger"])
.factory("BreadcrumbService", ["LogService", "$rootScope", (log, $rootScope) ->
  logId = "BreadcrumbService"

  data = {}
  ensureIdIsRegistered = (id) ->
    data[id] = []  if _.isNothing(data[id])

  push: (id, item, type, suppressUpdate) ->
    ensureIdIsRegistered id
    registeredItems =  _.where data, (i) ->
      i.id is item.id and i.name is item.name
    unless registeredItems.length
      data[id].push item
      log "data[#{id}].push:", logId
      log item
      unless suppressUpdate
        $rootScope.$broadcast Teseda.scope.events.breadcrumbs.update,
          id:id
          crumb:item
          index:data[id].length-1
          type: type

  get: (id) ->
    ensureIdIsRegistered id
    angular.copy data[id]

  setLastIndex: (id, idx, item, type) ->
    ensureIdIsRegistered id
    if data[id].length > 1 + idx
      data[id].splice 1 + idx, data[id].length - idx
    $rootScope.$broadcast Teseda.scope.events.breadcrumbs.update,
      id:id
      crumb:item
      index:idx
      type:type

  clear: (id) ->
    log "clear(#{id})", logId
    if _.isNothing(id)
      data = {}
    else
      data[id] = []

]).directive("breadcrumbs", ["LogService", "BreadcrumbService", (log, bcService) ->
  restrict: "A"
  template: """
  <div class="breadcrumb">
    <div class="content">
      <div
        class="crumb"
        data-ng-repeat='bc in breadcrumbs'
        data-ng-class="{'active': {{$last}} }"
        >
        <a
          data-ng-click="unregisterBreadCrumb( $index, bc )"
          data-ng-bind-html="bc.name"
          class="back-btn"
          ></a>
      </div>
    </div>
  </div>
  """
  replace: true
  compile: (tElement, tAttrs) ->
    (scope, element, attrs) ->
      bcId = "breadcrumb-#{attrs.breadcrumbs or _.uniqueId()}"
      type = attrs.type
      element.attr 'id', bcId

      resetCrumbs = ->
        scope.breadcrumbs = []
        _.forEach bcService.get(bcId), (v) ->
          scope.breadcrumbs.push v

      resetCrumbs()
      scope.unregisterBreadCrumb = (index, item) ->
        bcService.setLastIndex(bcId, index, item, type)
        resetCrumbs()

      scope.$on Teseda.scope.events.breadcrumbs.update, ->
        log Teseda.scope.events.breadcrumbs.update
        resetCrumbs()
])
