/*
  Breadcrumbs
*/
angular.module("Breadcrumbs.config", []).value("Breadcrumbs.config", {});

angular.module("Breadcrumbs", ["Breadcrumbs.config", "Logger"]).factory("BreadcrumbService", [
  "LogService", "$rootScope", function(log, $rootScope) {
    var data, ensureIdIsRegistered, logId;

    logId = "BreadcrumbService";
    data = {};
    ensureIdIsRegistered = function(id) {
      if (_.isNothing(data[id])) {
        return data[id] = [];
      }
    };
    return {
      push: function(id, item, type, suppressUpdate) {
        var registeredItems;

        ensureIdIsRegistered(id);
        registeredItems = _.where(data, function(i) {
          return i.id === item.id && i.name === item.name;
        });
        if (!registeredItems.length) {
          data[id].push(item);
          log("data[" + id + "].push:", logId);
          log(item);
          if (!suppressUpdate) {
            return $rootScope.$broadcast(Teseda.scope.events.breadcrumbs.update, {
              id: id,
              crumb: item,
              index: data[id].length - 1,
              type: type
            });
          }
        }
      },
      get: function(id) {
        ensureIdIsRegistered(id);
        return angular.copy(data[id]);
      },
      setLastIndex: function(id, idx, item, type) {
        ensureIdIsRegistered(id);
        if (data[id].length > 1 + idx) {
          data[id].splice(1 + idx, data[id].length - idx);
        }
        return $rootScope.$broadcast(Teseda.scope.events.breadcrumbs.update, {
          id: id,
          crumb: item,
          index: idx,
          type: type
        });
      },
      clear: function(id) {
        log("clear(" + id + ")", logId);
        if (_.isNothing(id)) {
          return data = {};
        } else {
          return data[id] = [];
        }
      }
    };
  }
]).directive("breadcrumbs", [
  "LogService", "BreadcrumbService", function(log, bcService) {
    return {
      restrict: "A",
      template: "<div class=\"breadcrumb\">\n  <div class=\"content\">\n    <div\n      class=\"crumb\"\n      data-ng-repeat='bc in breadcrumbs'\n      data-ng-class=\"{'active': {{$last}} }\"\n      >\n      <a\n        data-ng-click=\"unregisterBreadCrumb( $index, bc )\"\n        data-ng-bind-html=\"bc.name\"\n        class=\"back-btn\"\n        ></a>\n    </div>\n  </div>\n</div>",
      replace: true,
      compile: function(tElement, tAttrs) {
        return function(scope, element, attrs) {
          var bcId, resetCrumbs, type;

          bcId = "breadcrumb-" + (attrs.breadcrumbs || _.uniqueId());
          type = attrs.type;
          element.attr('id', bcId);
          resetCrumbs = function() {
            scope.breadcrumbs = [];
            return _.forEach(bcService.get(bcId), function(v) {
              return scope.breadcrumbs.push(v);
            });
          };
          resetCrumbs();
          scope.unregisterBreadCrumb = function(index, item) {
            bcService.setLastIndex(bcId, index, item, type);
            return resetCrumbs();
          };
          return scope.$on(Teseda.scope.events.breadcrumbs.update, function() {
            log(Teseda.scope.events.breadcrumbs.update);
            return resetCrumbs();
          });
        };
      }
    };
  }
]);
