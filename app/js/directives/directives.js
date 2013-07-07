angular.module("AppDirectives", ["StaticText"]).directive("bbTargetBlank", [
  '$timeout', function($timeout) {
    return {
      restrict: "A",
      link: function(scope, element) {
        return scope.$evalAsync(function() {
          return $timeout(function() {
            return element.find("a").attr("target", "_blank");
          }, 10);
        });
      }
    };
  }
]).directive('tesedaMenu', function() {
  var link;

  link = function(scope, element, attrs) {
    return scope.$watch('menuEnabled', function(val) {
      if (val) {
        return element.css('height', '165px');
      } else {
        return element.css('height', '0px');
      }
    });
  };
  return {
    restrict: 'A',
    link: link
  };
}).directive("bbNav", function() {
  var link;

  link = function(scope, element, attrs) {};
  return {
    restrict: "A",
    replace: true,
    templateUrl: "views/site/nav.html",
    link: link
  };
}).directive("bbAttr", function() {
  var link;

  link = function(scope, element, attrs) {
    var attr, parts, prop;

    parts = attrs.bbAttr.split(':');
    attr = parts[0];
    prop = parts[1];
    scope.$watch(prop, function(value) {
      if (value) {
        return element.attr("data-" + attr, true);
      } else {
        return element.attr("data-" + attr, false);
      }
    });
    return element.removeAttr("data-bb-attr");
  };
  return {
    restrict: "A",
    link: link
  };
}).directive("bbShare", [
  'LogService', '$rootScope', '$parse', 'StaticTextService', "ModalService", "ProjectService", function(log, $rootScope, $parse, statictext, modal, projectService) {
    var link;

    link = function(scope, element, attrs) {
      var customLink, elId, parsedProject, target, targetProject, title;

      elId = _.uniqueId('share-');
      element.attr('id', elId);
      if (attrs.targetProject) {
        if (attrs.targetProject === 'shared') {
          targetProject = projectService.shared().project;
        } else {
          parsedProject = $parse(attrs.targetProject);
          targetProject = parsedProject(scope);
        }
        target = scope.target;
      } else {
        target = targetProject = scope.target;
      }
      title = scope.title || statictext.share.title;
      customLink = attrs.customLink;
      scope.showOptions = function(e) {
        var kill;

        e.stopPropagation();
        if ($rootScope.isCurrentLocation(['/new', '/new?provider=true', '/new?provider'])) {
          $rootScope.alert(statictext.wraps.creationNotice);
          return;
        }
        kill = scope.$on(Teseda.scope.events.share.getShareTarget, function() {
          kill();
          return $rootScope.$broadcast(Teseda.scope.events.share.setShareTarget, {
            targetProject: targetProject,
            target: target,
            type: scope.type,
            title: title,
            customLink: customLink
          });
        });
        return modal.open('template/components/share-options.html', title);
      };
      scope.$watch('targetName', function(value) {
        if (value) {
          return title = "Share " + value + " via ...";
        }
      });
      return element.append("<div data-icon='share'></div>" + (scope.text ? scope.text : ''));
    };
    return {
      restrict: "A",
      replace: true,
      template: "<div class='action share' data-ng-click='showOptions($event)'></div>",
      scope: {
        targetName: '=?',
        target: '=',
        targetProject: '@',
        type: '@',
        title: '@',
        text: '@'
      },
      link: link
    };
  }
]).directive("bbToggleCommentInput", function() {
  var link;

  link = function(scope, element, attrs) {
    return scope.$watch("commentInputOn", function(val) {
      var $commentInput;

      $commentInput = angular.element("#comment-input-area textarea");
      if (val) {
        return $commentInput.css({
          width: (angular.element("#comment-input-area").width() - 100) + "px",
          height: "50px"
        });
      } else {
        $commentInput.css({
          width: $commentInput.css("max-width"),
          height: $commentInput.css("min-height")
        });
        return Teseda.util.hideBarScrollTo(50);
      }
    });
  };
  return {
    restrict: "A",
    link: link
  };
}).directive("bbTextAreaAutoGrow", function() {
  var linkFn;

  linkFn = function(scope, element, attrs) {
    element.attr("rows", 1);
    return element.autoGrow();
  };
  return {
    restrict: "A",
    link: linkFn
  };
}).directive("bbOptionMenu", [
  "LogService", "$rootScope", function(log, $rootScope) {
    var linkFn;

    linkFn = function(scope, element, attrs) {
      var menuPositionForScreen, optionMenuWidth;

      optionMenuWidth = function(width) {
        return {
          width: (width ? width : "auto")
        };
      };
      menuPositionForScreen = function(e) {
        var $target, needToScrollUp;

        $target = angular.element(e.target);
        if (scope.hoverTarget) {
          $target.closest(scope.hoverTarget).addClass("active");
        }
        needToScrollUp = ($(window).height() - e.clientY) < 300;
        if (needToScrollUp) {
          return $("html, body").animate({
            scrollTop: $target.offset().top - ($(".navbar").height() + 25)
          }, 300);
        }
      };
      scope.changeRoute = $rootScope.changeRoute;
      scope.changeProjectRoute = $rootScope.changeProjectRoute;
      return scope.optionMenu = {
        hoverTarget: attrs.hoverTarget,
        enabled: false,
        width: optionMenuWidth(attrs.width),
        activeWidth: optionMenuWidth(attrs.width),
        options: scope.options,
        activeOptions: scope.options,
        title: "",
        subOptionsEnabled: false,
        customViewOption: undefined,
        collection: attrs.collection,
        scroll: {
          defaults: undefined
        },
        label: function(option) {
          if (_.isFunction(option.label)) {
            return option.label(scope.target);
          } else {
            return option.label;
          }
        },
        showOption: function(option) {
          if (option.show) {
            if (option.showUseDependent) {
              return option.show(scope.target, scope.dependent);
            } else {
              return option.show(scope.target);
            }
          } else {
            return true;
          }
        },
        action: function(option) {
          var $callbacks, callback, i;

          if (scope.dependent) {
            option.action(scope.target, scope.dependent);
          } else {
            option.action(scope.target, scope);
          }
          if (option.actionCallbacks) {
            $callbacks = $.Callbacks();
            i = 0;
            while (i < option.actionCallbacks.length) {
              callback = option.actionCallbacks[i];
              $callbacks.add(callback.fn);
              if (callback.args) {
                $callbacks.fire(callback.args);
              } else {
                $callbacks.fire();
              }
              $callbacks.empty();
              i++;
            }
          }
          return this.enabled = false;
        },
        showSubOptions: function(option) {
          this.activeOptions = (_.isString(option.subOptions.options) ? scope.target[option.subOptions.options] : option.subOptions.options);
          this.title = this.label(option.subOptions);
          this.activeWidth = optionMenuWidth(option.width);
          if (option.subOptions.customViewOption) {
            this.customViewOption = option.subOptions.customViewOption;
          }
          return this.subOptionsEnabled = true;
        },
        back: function() {
          this.activeOptions = this.options;
          this.title = "";
          this.activeWidth = this.width;
          this.customViewOption = undefined;
          return this.subOptionsEnabled = false;
        },
        reset: function(e) {
          this.resetAllOptionMenus();
          if (e) {
            e.stopPropagation();
            if (scope.hoverTarget ? $(e.target).closest(scope.hoverTarget).length === 0 : void 0) {
              element.hide();
            }
          }
          log("--- reset option menu ---");
          if (this.enabled) {
            this.enabled = false;
            return this.back();
          }
        },
        resetAllOptionMenus: function() {
          angular.element(".option-menu").unbind("clickoutside");
          if (scope.hoverTarget) {
            return $(scope.hoverTarget).removeClass("active");
          }
        },
        toggle: function(e, indexOfOptionToPreSelect, $optionMenu) {
          var resetForTargetScope, thisOptionMenu;

          e.stopPropagation();
          thisOptionMenu = void 0;
          if ($optionMenu) {
            thisOptionMenu = $optionMenu.scope().optionMenu;
          } else {
            thisOptionMenu = angular.element(e.target).scope().optionMenu;
          }
          if (!thisOptionMenu.enabled) {
            thisOptionMenu.resetAllOptionMenus();
            menuPositionForScreen(e);
            if (indexOfOptionToPreSelect !== undefined) {
              thisOptionMenu.showSubOptions(thisOptionMenu.activeOptions[indexOfOptionToPreSelect]);
            }
            resetForTargetScope = function(e) {
              var $scope;

              log(e);
              log("clickoutside option menu");
              $scope = angular.element(e.currentTarget).scope();
              $scope.optionMenu.reset();
              return Teseda.util.safeApply($scope);
            };
            if ($optionMenu) {
              $optionMenu.bind("clickoutside", function(e) {
                e.stopPropagation();
                return resetForTargetScope(e);
              });
            } else {
              angular.element(e.target).closest(".option-menu").bind("clickoutside", function(e) {
                e.stopPropagation();
                return resetForTargetScope(e);
              });
            }
            return thisOptionMenu.enabled = true;
          } else {
            return thisOptionMenu.reset();
          }
        }
      };
    };
    return {
      restrict: "A",
      replace: true,
      scope: {
        show: "=",
        options: "=",
        target: "=",
        dependent: "="
      },
      templateUrl: "template/components/option-menu.html",
      link: linkFn
    };
  }
]).directive("bbClickEditText", [
  "LogService", function(log) {
    var linkFn;

    linkFn = function(scope, element, attrs) {
      var clickedInto, defaultBoldFirstLine, init, isModelValueBlank, killWatcher, modelExistingProp, modelProp, modelVal, resetPlaceholder, shownExisting, targetMultiple, updateModel;

      element.attr("contenteditable", true);
      modelProp = attrs.modelProp;
      modelExistingProp = attrs.modelExistingProp;
      targetMultiple = attrs.targetMultiple;
      defaultBoldFirstLine = "<span></span>";
      clickedInto = false;
      shownExisting = false;
      updateModel = function(value) {
        if (modelProp) {
          return scope.model[modelProp] = value;
        } else {
          return scope.model = value;
        }
      };
      modelVal = function() {
        if (modelProp) {
          return scope.model[modelProp];
        } else {
          return scope.model;
        }
      };
      isModelValueBlank = function(value) {
        return typeof value === "undefined" || value === "" || value === defaultBoldFirstLine || value === scope.placeholder;
      };
      resetPlaceholder = function() {
        if (targetMultiple) {
          return angular.element(targetMultiple).html(scope.placeholder);
        } else {
          return element.html(scope.placeholder);
        }
      };
      element.bind("click", function() {
        var $this;

        clickedInto = true;
        $this = angular.element(this);
        if (isModelValueBlank(modelVal()) || $this.html() === scope.placeholder) {
          return $this.html("");
        }
      });
      element.bind("keydown", function(e) {
        var $el, currentHtml, firstBreakIndex, firstLine, lineIndex;

        e.stopPropagation();
        if (e.keyCode === 9) {
          return false;
        }
        $el = angular.element(e.target);
        if (e.keyCode === 13) {
          if (scope.multiline) {
            if (scope.boldFirstLine) {
              currentHtml = $el.html();
              lineIndex = currentHtml.indexOf("<span>");
              if (lineIndex === -1) {
                $el.html("<span>" + $el.text() + "</span>");
              } else {
                firstBreakIndex = currentHtml.indexOf("</span>") + 9;
                firstLine = currentHtml.substring(0, firstBreakIndex);
                $el.html(firstLine + currentHtml.substring(firstBreakIndex, $el.html().length));
              }
              $el.focusEnd();
              return log($el.html());
            }
          } else {
            e.preventDefault();
            return false;
          }
        }
      });
      element.bind("keyup", function(e) {
        var $el, allOthers, currentHtml, lineIndex;

        $el = angular.element(e.target);
        if (String.fromCharCode(e.charCode)) {
          if (scope.multiline) {
            if (scope.boldFirstLine) {
              currentHtml = $el.html();
              lineIndex = currentHtml.indexOf("<span>");
              if (lineIndex === -1) {
                $el.html("<span>" + $el.text() + "</span>");
                $el.focusEnd();
              }
              log($el.html());
            }
          }
          updateModel($el.html());
          if (targetMultiple) {
            allOthers = _.reject(angular.element(targetMultiple), function(el) {
              return el === e.target;
            });
            return angular.element(allOthers).html($el.html());
          }
        }
      });
      element.bind("blur", function(e) {
        var $el;

        clickedInto = false;
        $el = angular.element(this);
        if (isModelValueBlank(modelVal()) || ($el.html() === scope.placeholder || $el.html() === "")) {
          return resetPlaceholder();
        }
      });
      init = function() {
        var existingValue;

        if (modelExistingProp) {
          existingValue = eval_("scope.model." + modelExistingProp);
          if (!shownExisting) {
            if (existingValue) {
              element.html(existingValue);
              updateModel(existingValue);
            } else {
              resetPlaceholder();
            }
            return shownExisting = true;
          }
        } else {
          if (isModelValueBlank(modelVal())) {
            return resetPlaceholder();
          }
        }
      };
      if (scope.model) {
        return init();
      } else {
        return killWatcher = scope.$watch("model", function(val) {
          if (val) {
            init();
            return killWatcher();
          }
        });
      }
    };
    return {
      restrict: "A",
      scope: {
        id: "=",
        model: "=",
        placeholder: "=",
        multiline: "=",
        boldFirstLine: "="
      },
      link: linkFn
    };
  }
]).directive("bbTimestamp", [
  "$rootScope", "$filter", function($rootScope, $filter) {
    var linkFn;

    linkFn = function(scope, element) {
      var isFull, isTimestampDisplayFull, timestampText;

      isTimestampDisplayFull = function() {
        var tsDisplaySetting;

        tsDisplaySetting = $rootScope.AppSettings.timestampDisplay;
        return tsDisplaySetting === undefined || (tsDisplaySetting && tsDisplaySetting === "full");
      };
      isFull = isTimestampDisplayFull();
      timestampText = function(scope) {
        return $filter((isFull ? "date" : "momentAgo"))(scope.bbTimestamp, Teseda.dateFormats[(isFull ? "full" : "ago")]);
      };
      element.css({
        cursor: "pointer",
        display: "inline-block"
      }).on("click", function(e) {
        e.stopPropagation();
        isFull = !isTimestampDisplayFull();
        _.forEach(angular.element(".timestamp"), function(el) {
          var $el;

          $el = angular.element(el);
          return $el.text(timestampText($el.scope()));
        });
        $rootScope.AppSettings.timestampDisplay = (isFull ? "full" : "ago");
        Teseda.util.safeApply($rootScope);
        return false;
      });
      return scope.$watch("bbTimestamp", function(val) {
        if (val) {
          return element.text(timestampText(scope));
        }
      });
    };
    return {
      restrict: "A",
      replace: true,
      scope: {
        bbTimestamp: "="
      },
      template: "<div class=\"timestamp\"></div>",
      link: linkFn
    };
  }
]).directive("bbInfiniteScroll", [
  "LogService", "$rootScope", "$timeout", function(log, $rootScope, $timeout) {
    return function(scope, element, attr) {
      var $window, id, infiniteTimeout, infiniteTimeoutReset, offset;

      offset = attr.bbInfiniteScroll || 50;
      id = attr.bbInfiniteScrollId || "body";
      $window = angular.element(window);
      infiniteTimeout = void 0;
      if (!$rootScope.hasOwnProperty("infiniteScrollLoading")) {
        $rootScope.infiniteScrollLoading = false;
      }
      $window.bind("scroll", function() {
        var buffer;

        buffer = element.height() - offset;
        if (buffer > -1 && ($window.scrollTop() + $window.height()) >= buffer) {
          if (!$rootScope.infiniteScrollLoading) {
            log(Teseda.scope.events.infiniteScroll.needMore);
            infiniteTimeoutReset();
            $rootScope.infiniteScrollLoading = true;
            $rootScope.$broadcast(Teseda.scope.events.infiniteScroll.needMore, id);
            return Teseda.util.safeApply($rootScope);
          }
        }
      });
      infiniteTimeoutReset = function() {
        if (infiniteTimeout) {
          $timeout.cancel(infiniteTimeout);
        }
        return infiniteTimeout = $timeout(function() {
          return $rootScope.infiniteScrollLoading = false;
        }, 1000);
      };
      return scope.$on(Teseda.scope.events.infiniteScroll.loadFinished, function(e) {
        log(Teseda.scope.events.infiniteScroll.loadFinished);
        $rootScope.infiniteScrollLoading = false;
        if (infiniteTimeout) {
          return $timeout.cancel(infiniteTimeout);
        }
      });
    };
  }
]).directive("bbBackgroundImage", [
  "$timeout", "$rootScope", "ElementResizerService", function($timeout, $rootScope, resizer) {
    var link;

    link = function(scope, element, attrs) {
      var addLoadingSpinner, adjustSizeForRetina, cancelLoadingTimers, imgHeight, imgWidth, loaded, loadingTimer, loadingTimerLimit, setup, updateImgDimensions;

      loaded = false;
      loadingTimer = void 0;
      loadingTimerLimit = void 0;
      imgWidth = void 0;
      imgHeight = void 0;
      cancelLoadingTimers = function() {
        if (loadingTimer) {
          $timeout.cancel(loadingTimer);
        }
        if (loadingTimerLimit) {
          return $timeout.cancel(loadingTimerLimit);
        }
      };
      addLoadingSpinner = function() {
        element.addClass('loading-image');
        return loadingTimerLimit = $timeout(function() {
          if (!loaded) {
            element.removeClass('loading-image');
            return element.removeClass('loading-failed');
          }
        }, 2000);
      };
      adjustSizeForRetina = function() {
        if (element.css("font-family") === "pixel-ratio-2") {
          imgWidth *= 2;
          return imgHeight *= 2;
        }
      };
      updateImgDimensions = function(width, height) {
        imgWidth = width;
        return imgHeight = height;
      };
      setup = function() {
        var cleanSrc, setupSrc, targetImage;

        if (Teseda.platform.IS_MOBILE && scope.widthMobile && scope.heightMobile) {
          updateImgDimensions(scope.widthMobile, scope.heightMobile);
        } else if (scope.width && scope.height) {
          updateImgDimensions(scope.width, scope.height);
        } else {
          updateImgDimensions(element.width(), element.height());
        }
        if (scope.responsive !== 'false') {
          adjustSizeForRetina();
        }
        targetImage = document.createElement("image");
        cleanSrc = void 0;
        targetImage.onload = function() {
          loaded = true;
          cancelLoadingTimers();
          targetImage.src = "";
          element.removeClass('loading-image');
          return element.css({
            "background-image": "url(" + cleanSrc + ")"
          });
        };
        setupSrc = function(url) {
          var cache, fit, parts;

          cleanSrc = url.replace(/\n/g, "");
          if (_.isNothing(scope.ignoreConvert) && cleanSrc.indexOf('filepicker') > -1 && cleanSrc.indexOf('convert') === -1) {
            parts = cleanSrc.split('?');
            fit = scope.fit || 'crop';
            cache = scope.cache ? "&cache=" + scope.cache : '';
            cleanSrc = "" + parts[0] + "/convert?w=" + (Math.floor(imgWidth)) + "&h=" + (Math.floor(imgHeight)) + "&fit=" + fit + cache + (parts.length > 1 ? "&" + parts[1] : "");
          }
          targetImage.src = cleanSrc;
          return loadingTimer = $timeout(function() {
            return addLoadingSpinner();
          }, 500);
        };
        if (!_.isNothing(scope.bbBackgroundImage)) {
          if (_.isString(scope.bbBackgroundImage)) {
            return setupSrc(scope.bbBackgroundImage);
          } else if (scope.bbBackgroundImage.exp) {
            return setupSrc(scope.bbBackgroundImage.url);
          }
        }
      };
      return scope.$watch("bbBackgroundImage", function(url) {
        if (url) {
          return setup();
        } else {
          return element.css({
            "background-image": ""
          });
        }
      }, true);
    };
    return {
      restrict: "A",
      scope: {
        bbBackgroundImage: "=",
        width: "@",
        height: "@",
        widthMobile: "@",
        heightMobile: "@",
        ignoreConvert: "@",
        responsive: "@",
        cache: "@",
        fit: "@"
      },
      link: link
    };
  }
]).directive("bbPhotoSwipe", [
  "$timeout", "$rootScope", function($timeout, $rootScope) {
    var link;

    link = function(scope, element, attrs) {
      var init, killListener, options, photoSwipe, setup;

      photoSwipe = void 0;
      options = {
        enableMouseWheel: !Teseda.platform.IS_MOBILE,
        enableKeyboard: !Teseda.platform.IS_MOBILE,
        captionAndToolbarAutoHideDelay: 0,
        backButtonHideEnabled: false
      };
      init = function() {
        return $timeout(function() {
          return setup();
        }, 200);
      };
      setup = function() {
        photoSwipe = $("#" + attrs.id + " a").photoSwipe(options);
      };
      scope.$on(Teseda.scope.events.photoSwipe.show, function(e, index) {
        return $timeout((function() {
          if (photoSwipe) {
            return photoSwipe.show(index);
          }
        }), 350);
      });
      scope.$on(Teseda.scope.events.photoSwipe.reset, function() {
        return init();
      });
      killListener = scope.$on("$routeChangeStart", function() {
        killListener();
        return $(".ps-toolbar-close").trigger("click");
      });
      return init();
    };
    return {
      restrict: "A",
      link: link
    };
  }
]).directive("bbSwipe", [
  "$timeout", "ElementResizerService", function($timeout, resizer) {
    var linkFn;

    linkFn = function(scope, element, attrs) {
      var $dot, $dotsContainer, $swipeControls, dotsPosition, emitEvents, fadeLast, i, isSwiping, moveProperty, moveSpeed, moveTarget, startSlide, swiper, totalDots, totalSlides;

      swiper = void 0;
      element.attr('id', _.uniqueId());
      scope.swipeNext = function(e) {
        e.stopPropagation();
        if (!_.isNothing(swiper)) {
          return swiper.next();
        }
      };
      scope.swipePrev = function(e) {
        e.stopPropagation();
        if (!_.isNothing(swiper)) {
          return swiper.prev();
        }
      };
      totalSlides = attrs.explicitTotal || element.find(".swipe-frame").length;
      startSlide = attrs.startSlide || 0;
      dotsPosition = attrs.dotsPosition;
      emitEvents = attrs.emitEvents === "true";
      moveTarget = attrs.moveTarget;
      moveProperty = attrs.moveProperty;
      moveSpeed = (attrs.moveSpeed ? parseInt(attrs.moveSpeed) : 3);
      isSwiping = false;
      fadeLast = attrs.fadeLast;
      $swipeControls = void 0;
      $dotsContainer = void 0;
      if (dotsPosition) {
        $swipeControls = $("<div class=\"swipe-controls\"><div class=\"dots-container\"></div></div>");
        $dotsContainer = $swipeControls.find("div.dots-container");
        totalDots = (fadeLast ? totalSlides - 1 : totalSlides);
        i = 0;
        while (i < totalDots) {
          $dot = $("<a href=\"javascript:void(0)\" class=\"dot\"><span class=\"dot-bkd iconfont\">x<span class=\"dot-fill\">y</span></span></a>");
          if (i === startSlide) {
            $dot.addClass("active");
          }
          $dotsContainer.append($dot);
          i++;
        }
        if (dotsPosition === "top") {
          $swipeControls.insertBefore(element);
        } else if (dotsPosition === "bottom") {
          $swipeControls.insertAfter(element);
        } else if (dotsPosition === "overlay") {
          element.append($swipeControls);
        }
      }
      $timeout(function() {
        var configSettings, startPosition;

        configSettings = {
          callback: function(event, index, elem) {
            var elId;

            elId = $(elem).attr("data-id");
            elId = (elId ? parseInt(elId) : 0);
            if (emitEvents) {
              scope.$emit("swipe", {
                id: elId,
                swipeIndex: index
              });
            }
            if ($swipeControls) {
              $swipeControls.find("a").removeClass("active");
              return $swipeControls.find("a").eq(index).addClass("active");
            }
          }
        };
        if (startSlide > 0) {
          _.extend(configSettings, {
            startSlide: startSlide
          });
        }
        if (moveTarget) {
          _.extend(configSettings, {
            dispatchEvents: true
          });
        }
        swiper = new Swipe(document.getElementById(element.attr('id')), configSettings);
        if (moveTarget) {
          moveTarget = $(moveTarget);
          if (fadeLast) {
            fadeLast = $(fadeLast);
          }
          startPosition = parseInt(moveTarget.css(moveProperty));
          swiper.on("SWIPING", function(pos) {
            var adjustedPos, inverse, onLastVisibleSlide, opacityLevel, positiveDelta;

            isSwiping = true;
            inverse = pos.translate3d < 0 || pos.translate3d > startPosition;
            adjustedPos = (pos.translate3d / moveSpeed) * (inverse ? 1 : -1);
            if (inverse) {
              adjustedPos += startPosition;
            } else {
              adjustedPos -= startPosition;
            }
            moveTarget.css(moveProperty, adjustedPos + "px");
            onLastVisibleSlide = pos.index + 1 === totalSlides - 1;
            if (fadeLast && onLastVisibleSlide && pos.deltaX < 0) {
              positiveDelta = (pos.deltaX < 0 ? pos.deltaX * -1 : pos.deltaX);
              opacityLevel = (100 - positiveDelta) / 100;
              return fadeLast.css("opacity", opacityLevel);
            }
          });
          swiper.on("SLIDE", function(pos) {
            var adjustedPos, animateProp, inverse, onLastVisibleSlide;

            inverse = pos.translate3d < 0 || pos.translate3d > startPosition;
            adjustedPos = (pos.translate3d / moveSpeed) * (inverse ? 1 : -1);
            if (inverse) {
              adjustedPos += startPosition;
            } else {
              adjustedPos -= startPosition;
            }
            animateProp = {};
            animateProp[moveProperty] = adjustedPos + "px";
            moveTarget.animate(animateProp, 300);
            isSwiping = false;
            if (fadeLast) {
              onLastVisibleSlide = pos.index + 1 === totalSlides - 1;
              if (onLastVisibleSlide) {
                return fadeLast.animate({
                  opacity: 1
                }, 300);
              } else {
                if (pos.index + 1 === totalSlides) {
                  return scope.$emit("swipe:remove");
                }
              }
            }
          });
        }
        if (attrs.clickToSwipe) {
          element.find("li.swipe-content").on("click", function() {
            if (!isSwiping) {
              return swiper.next();
            }
          });
        }
        if ($swipeControls) {
          return $swipeControls.find("a:not(.swipe-hint)").bind("click", function() {
            $swipeControls.find("a").removeClass("active");
            $(this).addClass("active");
            return swiper.slide($swipeControls.find("a").index($(this)));
          });
        }
      }, 0);
      return scope.$watch('bbSwipe', function(value) {
        if (value && value.length > 1) {
          return element.find('.nav').show();
        } else {
          return element.find('.nav').hide();
        }
      });
    };
    return {
      restrict: "A",
      scope: {
        bbSwipe: '='
      },
      link: linkFn
    };
  }
]).directive("bbEditField", [
  "$rootScope", "StaticTextService", function($rootScope, statictext) {
    var link;

    link = function(scope, element, attrs) {
      var $field, $placeholder, $remove, autocapitalize, autocorrect, defaultBlankValue, disabledMsg, iconStyle, init, isDisabled, killWatcher, maxlength, modelName, modelProp, parentScope, placeholderValue, type, updateModel;

      modelName = attrs.model;
      modelProp = attrs.modelProp;
      defaultBlankValue = (attrs.staticTextKey ? statictext[attrs.staticTextKey] : "");
      type = attrs.type;
      autocorrect = attrs.autocorrect;
      autocapitalize = attrs.autocapitalize;
      maxlength = attrs.maxlength;
      isDisabled = attrs.disabled;
      disabledMsg = scope.disabledMsg;
      parentScope = attrs.parentScope === "true";
      switch (type) {
        case "text":
          element.append("<input placeholder=\"" + scope.placeholder + "\" type=\"text\" autocorrect=\"" + (autocorrect ? autocorrect : "off") + "\" autocapitalize=\"" + (autocapitalize ? autocapitalize : "off") + "\"" + (maxlength ? " maxlength=\"" + maxlength + "\"" : "") + "/>");
          break;
        case "textarea":
          element.append("<textarea placeholder=\"" + scope.placeholder + "\" type=\"text\" autocorrect=\"" + (autocorrect ? autocorrect : "off") + "\" autocapitalize=\"" + (autocapitalize ? autocapitalize : "off") + "\"" + (maxlength ? " maxlength=\"" + maxlength + "\"" : "") + "></textarea>");
      }
      $field = element.find("input, textarea");
      $placeholder = void 0;
      $remove = void 0;
      updateModel = function(value) {
        if (modelProp) {
          return scope.model[modelProp] = value;
        } else {
          return scope.model = value;
        }
      };
      placeholderValue = function() {
        return scope.placeholderMarketing || scope.placeholder;
      };
      $field.on("focus", function(e) {
        if (isDisabled) {
          e.preventDefault();
          e.stopPropagation();
          $field.trigger("blur");
          if (disabledMsg) {
            $rootScope.alert(disabledMsg);
          }
          return false;
        }
        $field.css("opacity", 1);
        $placeholder.hide();
        $field.addClass("editing");
        if ($remove) {
          $remove.show();
        }
        if (scope.removable) {
          return element.removeClass("dotted");
        }
      });
      $field.on("blur", function(e) {
        if ($field.val() === "") {
          $field.css("opacity", 0);
          $placeholder.show();
          $field.removeClass("editing");
          $field.css({
            height: "",
            width: ""
          });
          if ($remove) {
            $remove.hide();
          }
          if (scope.removable) {
            return element.addClass("dotted");
          }
        } else {
          return $placeholder.hide();
        }
      });
      $field.on("keyup", function(e) {
        return updateModel($field.val());
      });
      element.append("<span class=\"input-placeholder\">" + placeholderValue() + "</span>");
      $placeholder = element.find(".input-placeholder");
      if (scope.removable) {
        element.addClass("dotted");
        if (!isDisabled) {
          iconStyle = "";
          element.append("<a class=\"icon-remove-circle " + iconStyle + "\"></a>");
          $remove = element.find(".icon-remove-circle");
          $remove.on("click", function() {
            $field.val("");
            $field.trigger("blur");
            return updateModel("");
          });
        }
      }
      init = function() {
        var initialValue;

        initialValue = scope.model[modelProp];
        if (initialValue === defaultBlankValue || (initialValue == null) || initialValue === "" || typeof initialValue === "undefined") {
          updateModel("");
          $field.css("opacity", 0);
          if ($remove) {
            return $remove.hide();
          }
        } else {
          $field.val(initialValue);
          $field.addClass("editing");
          $field.css("opacity", 1);
          return $placeholder.hide();
        }
      };
      if (scope.model) {
        return init();
      } else {
        scope = (parentScope ? scope.$parent : scope);
        return killWatcher = scope.$watch(modelName, function(value) {
          if (value) {
            scope.model = value;
            init();
            return killWatcher();
          }
        });
      }
    };
    return {
      restrict: "A",
      replace: true,
      scope: {
        model: "=",
        placeholder: "=",
        placeholderMarketing: "=",
        disabledMsg: "=",
        removable: "="
      },
      template: "<div class=\"field-container\"><div class=\"dimmer\"></div></div>",
      link: link
    };
  }
]).directive("bbEditContactFields", [
  "$rootScope", "$timeout", "ProjectService", function($rootScope, $timeout, projectService) {
    var link;

    link = function(scope, element, attrs) {
      var excludeLabels, init, onlyLabels, placeholderValue;

      excludeLabels = attrs.excludeLabels ? excludeLabels.split(",") : void 0;
      onlyLabels = attrs.onlyLabels ? attrs.onlyLabels.split(",") : void 0;
      placeholderValue = function() {
        return scope.placeholderMarketing || scope.placeholder;
      };
      init = function() {
        var $addMoreContactSelect, $selectContactArea, addAddress, addContact, addrLabel, hasExistingContacts, selectBlur;

        scope.model = scope.model || {};
        if (_.isUndefined(scope.model.contacts)) {
          scope.model.contacts = [];
        }
        $selectContactArea = element.find(".select-contact-field");
        $addMoreContactSelect = $selectContactArea.find("select");
        if (excludeLabels) {
          scope.contactOptionLabels = _.reject(projectService.contactOptions.labels, function(l) {
            return _.contains(excludeLabels, l.label);
          });
        } else if (onlyLabels) {
          scope.contactOptionLabels = _.where(projectService.contactOptions.labels, function(l) {
            return _.contains(onlyLabels, l.label);
          });
        } else {
          scope.contactOptionLabels = projectService.contactOptions.labels;
        }
        scope.addMoreContacts = "";
        scope.changeAdditional = function(e, contact) {
          var $el, addressType;

          $el = angular.element(e.target);
          addressType = $el.attr("data-address");
          if (addressType) {
            return updateModel($el.val(), addressType);
          } else {
            return updateModel($el.val(), "contact" + contact.id);
          }
        };
        scope.modifyContactType = function(e, contact) {
          var $el;

          $el = angular.element(e.target);
          if ($el.val() !== "") {
            return contact.defaultType = $el.val();
          }
        };
        addAddress = function(label, address) {
          var newAddress;

          newAddress = _.extend({
            id: _.uniqueId(),
            title: address ? address.title : "",
            address: address ? address.address : "",
            city: address ? address.city : "",
            state: address ? address.state : "",
            zip: address ? address.zip : ""
          }, _.clone(label, true));
          return scope.model.contacts.push(newAddress);
        };
        addContact = function(label, contact) {
          var newContact;

          newContact = _.extend({
            id: _.uniqueId()
          }, _.clone(label, true));
          return scope.model.contacts.push(newContact);
        };
        scope.addContactOption = function(e) {
          var $select, contactLabel;

          $select = angular.element(e.target);
          if ($select.val() !== "") {
            contactLabel = _.find(projectService.contactOptions.labels, function(opt) {
              return opt.label === $select.val();
            });
            if (contactLabel.label === "Address") {
              addAddress(contactLabel);
            } else {
              addContact(contactLabel);
            }
            return $selectContactArea.addClass("added dotted");
          }
        };
        scope.removeAdditionalContact = function(e, contact) {
          var contactIndex;

          e.stopPropagation();
          contactIndex = _.indexOf(_.pluck(scope.model.contacts, "id"), contact.id);
          if (_.isNothing(scope.model.removedContacts)) {
            scope.model.removedContacts = [];
          }
          scope.model.removedContacts.push(contact);
          scope.model.contacts.splice(contactIndex, 1);
          if (scope.model.contacts.length === 0) {
            $selectContactArea.removeClass("added dotted");
            selectBlur();
          }
          return $timeout(function() {
            return Teseda.util.safeApply(scope);
          }, 50);
        };
        scope.resetOnBlur = function(e) {
          var $select;

          $select = angular.element(e.target);
          scope.addMoreContacts = "";
          return $select.val("");
        };
        selectBlur = function() {
          if (scope.model.contacts.length === 0) {
            return element.addClass("dotted");
          }
        };
        hasExistingContacts = false;
        if (hasExistingContacts) {
          $selectContactArea.addClass("added dotted");
        } else {
          element.addClass("dotted");
          $addMoreContactSelect.on("focus", function() {
            return element.removeClass("dotted");
          });
          $addMoreContactSelect.on("blur", selectBlur);
        }
        if (onlyLabels && _.first(onlyLabels) === "Address") {
          $addMoreContactSelect.remove();
          if (!scope.model.name) {
            addrLabel = {
              label: "Address",
              types: Teseda.contacts.defaultTypes(),
              defaultType: Teseda.contacts.address.defaultType
            };
            return addAddress(addrLabel);
          }
        }
      };
      return init();
    };
    return {
      restrict: "A",
      replace: true,
      scope: {
        model: "=",
        limit: "=?",
        placeholder: "=",
        placeholderMarketing: "="
      },
      templateUrl: "template/components/project/bb-edit-contact-fields.html",
      link: link
    };
  }
]).directive("bbPrettyText", [
  '$filter', function($filter) {
    var link;

    link = function(scope, element, attrs) {
      var updateText;

      updateText = function() {
        element.html(linkify($filter('breakToBr')(scope.text)));
        return element.find("a").attr("target", "_blank");
      };
      return scope.$watch('text', function(value) {
        return updateText();
      });
    };
    return {
      restrict: "A",
      scope: {
        text: '=bbPrettyText'
      },
      link: link
    };
  }
]).directive("bbGridFooterBar", [
  "$compile", "$http", function($compile, $http) {
    var ngGridFooter;

    ngGridFooter = {
      scope: false,
      compile: function() {
        return {
          pre: function($scope, iElement, iAttrs) {
            return $http.get("template/components/grid/control-bar.html").success(function(template) {
              if (iElement.children().length === 0) {
                return iElement.append($compile(template)($scope.$parent.$parent.gridOptions.$gridScope));
              }
            });
          }
        };
      }
    };
    return ngGridFooter;
  }
]).directive("bbScrollTo", [
  "$rootScope", "ProjectService", "$window", "$location", "$timeout", function($rootScope, projectService, $window, $location, $timeout) {
    var linker;

    linker = function(scope, element, attrs) {
      return $timeout(function() {
        if (scope.$eval(attrs.ngShow)) {
          return $($window).scrollTop(element.offset().top);
        }
      }, 200);
    };
    return {
      restrict: "A",
      link: linker
    };
  }
]).directive("bbAzThumbscroller", [
  "LogService", "$window", "$timeout", "$rootScope", "FAKE_MOBILE", "SearchService", function(log, $window, $timeout, $rootScope, fakeMobile, searchService) {
    var linkFn;

    linkFn = function(scope, element, attrs) {
      var getDimensions, letterHeight, scrolling, selections, targetClassPrefix, touchEnd, touchMove, touchStart, yOffset;

      if (fakeMobile || (Teseda.platform.IS_MOBILE && !Teseda.platform.IS_ANDROID)) {
        scrolling = false;
        yOffset = void 0;
        letterHeight = void 0;
        selections = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "numeric"];
        targetClassPrefix = attrs.targetClassPrefix;
        getDimensions = function() {
          yOffset = parseInt(element.css("top"), 10);
          return letterHeight = element.height() / selections.length;
        };
        touchStart = function(e) {
          e.preventDefault();
          scrolling = true;
          return element.addClass("active");
        };
        touchMove = function(e) {
          var letter, targetAnchor;

          e.preventDefault();
          if (e.originalEvent) {
            e = e.originalEvent;
            if (e.touches) {
              e = e.touches[0];
            }
          }
          letter = selections[Math.floor((e.clientY - yOffset) / letterHeight)];
          if (scrolling) {
            element.find(".popout").removeClass("popout").end().find(".list-" + letter).addClass("popout");
            targetAnchor = $(targetClassPrefix + letter);
            if (targetAnchor.length) {
              return $($window).scrollTop($(targetClassPrefix + letter).eq(0).offset().top - 50);
            }
          }
        };
        touchEnd = function(e) {
          e.preventDefault();
          scrolling = false;
          return element.removeClass("active").find(".popout").removeClass("popout");
        };
        angular.element(window).on("orientationchange", function() {
          return getDimensions();
        });
        $timeout(function() {
          getDimensions();
          element.on("touchstart", function(e) {
            return touchStart(e);
          });
          element.on("touchmove", function(e) {
            return touchMove(e);
          });
          return element.on("touchend", function(e) {
            return touchEnd(e);
          });
        }, 200);
        return scope.$on(Teseda.scope.events.sidebar.change, function(e, result) {
          if (result.enabled) {
            return element.hide();
          } else {
            return element.show();
          }
        });
      } else {
        return element.remove();
      }
    };
    return {
      restrict: "A",
      scope: {
        hide: "="
      },
      replace: true,
      templateUrl: "template/components/az-scroller.html",
      link: linkFn
    };
  }
]).directive('scrollTopLink', [
  '$location', '$rootScope', function($location, $rootScope) {
    var link;

    link = function(scope, element, attrs) {
      return element.bind('click', function() {
        $rootScope.safeApply(function() {
          return $location.hash('');
        });
        $('html, body').animate({
          scrollTop: 0
        }, 500);
        return false;
      });
    };
    return {
      restrict: 'A',
      link: link
    };
  }
]);
