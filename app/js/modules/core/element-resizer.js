/*
  Element Resizer Service - aids responsive design
*/
angular.module("ElementResizer.config", []).value("ElementResizer.config", {});

angular.module("ElementResizer", ["Logger", "ElementResizer.config"]).factory("ElementResizerService", [
  "LogService", "ElementResizer.config", "$rootScope", "$window", "$timeout", function(log, config, $rootScope, $window, $timeout) {
    var api, logId;

    logId = "ElementResizerService";
    api = {};
    api.venue = config.venue;
    api.enabled = config.enabled;
    _.forEach(config.targets, function(target) {
      return target.id = _.uniqueId();
    });
    api.targets = config.targets;
    api.register = function(target) {
      var existing;

      if (!target.id) {
        log('please add \'id\' using _.uniqueId() to identify your target before registering!');
      }
      existing = _.pluck(api.targets, 'id');
      if (!_.contains(existing, target.id)) {
        return api.targets.push(target);
      }
    };
    api.deregister = function(target) {
      var existing, targetIndex;

      existing = _.pluck(api.targets, 'id');
      targetIndex = _.indexOf(existing, target.id);
      if (targetIndex > -1) {
        return api.targets.splice(targetIndex, 1);
      }
    };
    api.isRegistered = function(obj) {
      var objs;

      objs = _.pluck(api.targets, 'obj');
      return _.contains(objs, obj);
    };
    api.resize = function() {
      var screenSize, winWidth;

      if (api.enabled) {
        if (config.debug) {
          log('resize', logId);
        }
        screenSize = Teseda.util.detectScreenSize();
        winWidth = screenSize.width;
        return _.forEach(api.targets, function(target) {
          var currentSize, size, venueWidthPercent;

          if (_.isNothing(target.dontRemoveAttribute)) {
            target.dontRemoveAttribute = false;
          }
          if (_.isNothing(target.ignoreAbove)) {
            target.ignoreAbove = 999999;
          }
          if (_.isNothing(target.ignoreBelow)) {
            target.ignoreBelow = 0;
          }
          if (_.isNothing(target.staticOffset)) {
            target.staticOffset = 0;
          }
          if (target.remover) {
            return api.remover(target, winWidth);
          } else {
            venueWidthPercent = (winWidth - api.venue.min) / (api.venue.max - api.venue.min);
            currentSize = venueWidthPercent * (target.max - target.min) + target.min;
            if (target.debug) {
              log(" ---------- element-resizer debug ----------");
              log("obj: " + target.obj);
              log("attr: " + target.attr);
              log("winWidth: " + winWidth);
              log("ignoreBelow: " + target.ignoreBelow);
              log("ignoreAbove: " + target.ignoreAbove);
              log("min: " + target.min);
              log("max: " + target.max);
              log("staticOffset: " + target.staticOffset);
            }
            if (winWidth >= target.ignoreBelow && winWidth <= target.ignoreAbove) {
              if (target.debug) {
                log("winWidth >= target.ignoreBelow and winWidth <= target.ignoreAbove: TRUE");
              }
              if (target.min > 0 && target.max > 0) {
                if (currentSize > target.max) {
                  size = target.max;
                } else {
                  size = currentSize;
                }
              } else {
                if (currentSize < target.max) {
                  size = target.max;
                } else {
                  size = currentSize;
                }
              }
              if (target.staticOffset) {
                size = size + target.staticOffset;
              }
              if (target.debug) {
                log("SIZE to set: " + size);
              }
              if (target.attr === "background-size") {
                $(target.obj).css(target.attr, ("" + size + "px ") + ("" + (size * target.ratio) + "px"));
              } else {
                $(target.obj).css(target.attr, "" + size + "px");
              }
            } else {
              if (target.debug) {
                log("IGNORING ~");
              }
              if (!target.dontRemoveAttribute) {
                if (target.debug) {
                  log("dontRemoveAttribute: TRUE");
                }
                $(target.obj).css(target.attr, "");
              }
            }
            return size;
          }
        });
      }
    };
    api.remover = function(target, winWidth) {
      if (winWidth <= target.ignoreAbove) {
        return $(target.obj).css(target.attr, "");
      }
    };
    api.refresh = function() {
      return api.resize();
    };
    return api;
  }
]).directive("bbResize", [
  "LogService", "ElementResizerService", function(log, resizer) {
    var link;

    link = function(scope, element, attrs) {
      var target;

      if (!resizer.isRegistered(attrs.bbResize)) {
        target = {
          id: _.uniqueId(),
          obj: attrs.bbResize,
          attr: attrs.rAttr,
          max: Number(attrs.rMax),
          min: Number(attrs.rMin)
        };
        return resizer.register(target);
      }
    };
    return {
      restrict: "A",
      link: link
    };
  }
]).run([
  "LogService", "ElementResizerService", "$window", "$timeout", "$rootScope", function(log, resizer, $window, $timeout, $rootScope) {
    if (resizer.enabled) {
      $rootScope.$on('$viewContentLoaded', function() {
        log('$viewContentLoaded');
        return resizer.refresh();
      });
      return angular.element($window).bind('resize', function() {
        log('window resize');
        return $rootScope.safeApply(function() {
          return resizer.refresh();
        });
      });
    }
  }
]);
