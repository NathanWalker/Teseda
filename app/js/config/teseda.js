var Teseda, portNumber;

Teseda = {
  name: "Teseda",
  defaults: {},
  prop: {
    docReadyTime: 0,
    clientOnline: true,
    userHasBeenPromptedToShareLocation: false,
    isFullscreen: navigator.hasOwnProperty && navigator.hasOwnProperty("standalone") && navigator.standalone,
    debug: location.hostname.indexOf("teseda") === -1,
    maxThumbnailPreviewSize: 5 * 1024 * 1024,
    version: "",
    webWorkersAvailable: window && window.Worker,
    supportedTypes: {
      images: ["image/jpeg", "image/png", "image/gif"]
    },
    transparent: "img/vendor/transparent.gif"
  },
  sortOrder: {
    types: ['asc', 'desc']
  },
  localStorage: {
    keyNames: {
      currentUser: "currentUser"
    }
  },
  scope: {
    events: {
      errors: {
        unauthorized: "401",
        internalServerError: "500"
      },
      user: {
        refresh: "user:refresh",
        refreshSuccess: "user:refresh:success",
        authenticatedYes: "user:authenticated:yes",
        authenticatedNo: "user:authenticated:no",
        loginRequired: "user:loginRequired",
        createNew: "user:createNew"
      },
      infiniteScroll: {
        needMore: "infiniteScroll:needMore",
        loadFinished: "infiniteScroll:loadFinished"
      },
      photoSwipe: {
        reset: "photoSwipe:reset",
        show: "photoSwipe:show"
      },
      google: {
        mapsReady: "google:mapsReady"
      },
      sidebar: {
        change: "sidebar:change",
        toggleLeft: "sidebar:toggle:left",
        toggleRight: "sidebar:toggle:right"
      },
      modal: {
        close: "modal:close"
      },
      breadcrumbs: {
        update: "breadcrumbs:update"
      },
      site: {
        showLoading: "site:showLoading",
        cancelLoading: "site:cancelLoading",
        updateLoadingMsg: "site:updateLoadingMsg",
        rootViewReady: "site:rootViewReady",
        imageCropped: "site:imageCropped"
      }
    }
  },
  platform: {
    IS_MOBILE: false,
    IS_ANDROID: false,
    IS_IOS: false,
    IS_IPHONE: false,
    IS_IPAD: false,
    IS_OTHER: false,
    IS_LEGACY_IE: false,
    IS_LEGACY_ANDROID: false,
    IS_LEGACY_IOS: false,
    version: [0]
  },
  regex: {
    isoDateTime: /^(\d{4})(?:-?W(\d+)(?:-?(\d+)D?)?|(?:-(\d+))?-(\d+))(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/,
    urlHostAndPath: /^([^:]+:\/\/\w+:?\w*@?[\w\.-]*(?::[0-9]+)?)(\/.*)/,
    email: /^[A-z0-9._%-]+@[A-z0-9._%-]+\.[A-z]{2,4}$/,
    phone: /^(?:1[-. ]?)?\s?\(?[0-9]{3}\)?[-. ]?[0-9]{3}[-. ]?[0-9]{4}(?:\s?[xX]\s?[0-9]{1,8})?$/
  },
  uri: {
    host: location.protocol + "//" + location.hostname,
    apiRoot: "/v1/",
    frontendPort: 8000,
    backendPort: 3000,
    testingPorts: [9201, 9202, 9203, 8100],
    server: "",
    apiServerHost: "",
    apiServer: ""
  },
  thirdParties: {
    google_oauth2: {
      label: "Google",
      name: "google",
      url: "/auth/google_oauth2/start",
      order: 1
    },
    linkedin: {
      label: "LinkedIn",
      name: "linkedin",
      url: "/auth/linkedin/start",
      order: 2
    },
    twitter: {
      label: "Twitter",
      name: "twitter",
      url: "/auth/twitter/start",
      order: 3
    },
    facebook: {
      label: "Facebook",
      name: "facebook",
      url: "/auth/facebook/start",
      order: 4
    }
  },
  dateFormats: {
    full: "EEEE, MMM d, y @ h:mm a",
    short: "MM/dd/yy h:mm a",
    ago: "YYYYMMDDThhmmssZ"
  },
  util: {
    randomCharacters: function(maxlength) {
      var charCount, charGroups, chars, floor, i, j, numCount, random, randomChars, rnum, temp;

      chars = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghiJklmnopqrstuvwxyz", "0123456789", "!@#$%^&*()-_=+,.<>/?;:[]{}~"];
      charGroups = [1, 1, 1, 1];
      randomChars = [];
      charCount = 0;
      numCount = 0;
      rnum = void 0;
      floor = Math.floor;
      random = Math.random;
      i = void 0;
      j = void 0;
      temp = void 0;
      i = 0;
      while (i < (maxlength - charGroups.length)) {
        charGroups[floor(random() * chars.length)]++;
        i++;
      }
      _.forEach(charGroups, function(count, index) {
        var _results;

        _results = [];
        while (count--) {
          rnum = floor(random() * chars[index].length);
          _results.push(randomChars.push(chars[index].substr(rnum, 1)));
        }
        return _results;
      });
      i = randomChars.length;
      while (--i) {
        j = floor(random() * (i + 1));
        temp = randomChars[i];
        randomChars[i] = randomChars[j];
        randomChars[j] = temp;
      }
      return randomChars.slice(0, maxlength).join("");
    },
    earthDistance: function(lat1, lon1, lat2, lon2) {
      var PI, acos, cos, earthRadius, sin;

      earthRadius = 6371000;
      PI = Math.PI;
      acos = Math.acos;
      cos = Math.cos;
      sin = Math.sin;
      lat1 = lat1 * (PI / 180);
      lat2 = lat2 * (PI / 180);
      lon1 = lon1 * (PI / 180);
      lon2 = lon2 * (PI / 180);
      return acos(sin(lat1) * sin(lat2) + cos(lat1) * cos(lat2) * cos(lon2 - lon1)) * earthRadius;
    },
    safeApply: function(s) {
      var phase;

      phase = s.$root.$$phase;
      if (phase !== "$apply" && phase !== "$digest") {
        return s.$apply();
      }
    },
    imageUrlCleaner: function(url) {
      if (url && Teseda.prop.debug && window.location.hostname.indexOf("localhost") === -1) {
        return url.replace(/localhost/, window.location.hostname);
      } else {
        return url;
      }
    },
    allowZoom: function(flag) {
      if (flag === true) {
        angular.element("head meta[name=viewport]").remove();
        return angular.element("head").prepend("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=10.0, minimum-scale=1, user-scalable=1\" />");
      } else {
        angular.element("head meta[name=viewport]").remove();
        return angular.element("head").prepend("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0\" />");
      }
    },
    routeCleaner: function(route) {
      route = route.toString();
      if (route !== "" && route.indexOf("/") !== 0) {
        route = "/" + route;
      }
      return route;
    },
    pageClassFromRoute: function(route) {
      var pageName;

      if (route) {
        if (route.indexOf("/") === 0) {
          route = route.substring(1, route.length);
        }
        pageName = route.split("/").join("-").split("?")[0];
        if (pageName === "") {
          return "home";
        } else {
          return pageName;
        }
      } else {
        return "";
      }
    },
    detectScreenSize: function() {
      var h, screenSize, w;

      w = 0;
      h = 0;
      screenSize = {};
      if (Teseda.platform.IS_MOBILE && Teseda.platform.IS_ANDROID) {
        if (Teseda.platform.IS_LEGACY_ANDROID) {
          w = document.width;
          h = document.height;
        }
      }
      if (_.isNothing(w) || _.isNothing(h)) {
        w = $(window).outerWidth(true);
        h = $(window).outerHeight(true);
      }
      screenSize.height = h;
      screenSize.width = w;
      return screenSize;
    },
    disableTouchMove: function(e) {
      if (e) {
        return e.preventDefault();
      }
    },
    isImageType: function(type) {
      return type.search(/image\/(gif|jpeg|png|tiff)/) > -1;
    },
    parseVersion: function(version, splitChar) {
      splitChar = splitChar || ".";
      if (typeof version === "string" && version.length > 0) {
        return version.split(splitChar);
      } else {
        return [0];
      }
    },
    stripHTML: function(html) {
      return (html || "").replace("<br>", "\n").replace("<br/>", "\n").replace("<br />", "\n").replace(/<\/?[a-z][a-z0-9]*[^<>]*>/g, "");
    },
    toggleSpinner: function(targetSelector, on_, options) {
      if (on_ && $(targetSelector + " .spinjs").length === 0) {
        return $(targetSelector).spin($.extend({
          className: "spinjs",
          color: "#fff"
        }, options));
      } else {
        if (on_ === false) {
          return $(targetSelector).spin(false);
        }
      }
    },
    hideBarScrollTo: function(timeoutDelay, scrollToPosition) {
      return setTimeout((function() {
        return window.scrollTo(0, (scrollToPosition ? scrollToPosition : Teseda.platform.scrollTop));
      }), timeoutDelay);
    }
  }
};

Teseda.defaults.sortOrder = _.first(Teseda.sortOrder.types);

Teseda.prop.version = Teseda.util.parseVersion(CONFIG.version);

Teseda.uri.server = Teseda.uri.host + (window.location.port ? ":" + window.location.port : "");

if (Teseda.uri.host === "https://staging.teseda.com") {
  Teseda.uri.apiServerHost = "https://api-staging.teseda.com";
} else if (Teseda.uri.host === "https://www.teseda.com") {
  Teseda.uri.apiServerHost = "https://api.teseda.com";
} else {
  Teseda.uri.apiServerHost = Teseda.uri.host + (window.location.port ? ":" + Teseda.uri.backendPort : "");
}

Teseda.uri.apiServer = Teseda.uri.apiServerHost + Teseda.uri.apiRoot;

portNumber = parseInt(window.location.port, 10);

Teseda.prop.debug = _.contains(Teseda.uri.host, "localhost") && !_.contains(Teseda.uri.testingPorts, portNumber);

_.mixin({
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },
  pluralize: function(string) {
    return string + "s";
  },
  isNothing: function(value) {
    return _.isUndefined(value) || _.isNaN(value) || _.isNull(value) || value === 0;
  },
  move: function(array, old_index, new_index) {
    var k;

    if (new_index >= array.length) {
      k = new_index - array.length;
      while ((k--) + 1) {
        array.push(undefined);
      }
    }
    return array.splice(new_index, 0, array.splice(old_index, 1)[0]);
  }
});

(function() {
  var ieVersion, isFullscreen, newSettings, parseVersion, ua;

  ua = navigator.userAgent.toLowerCase();
  newSettings = {};
  parseVersion = Teseda.util.parseVersion;
  isFullscreen = Teseda.prop.isFullscreen;
  ieVersion = (function() {
    var all, div, undef, v;

    undef = void 0;
    v = 3;
    div = document.createElement("div");
    all = div.getElementsByTagName("i");
    while (all[0]) {
      div.innerHTML = "<!--[if gt IE " + (++v) + "]><i></i><![endif]-->";
    }
    if (v > 4) {
      return v;
    } else {
      return undef;
    }
  })();
  if (ua.match(/android/i)) {
    newSettings = {
      IS_MOBILE: true,
      IS_ANDROID: true,
      name: "android",
      version: parseVersion(ua.match(/android ([\d\.]+)/)[1], "."),
      scrollTop: 1,
      addressBarHeight: 57,
      prevOrientation: window.orientation
    };
  } else if (ua.match(/ipad/i)) {
    newSettings = {
      IS_MOBILE: true,
      IS_IOS: true,
      IS_IPAD: true,
      name: "ipad",
      version: parseVersion(ua.match(/cpu os ([\d_]+)/)[1], "_"),
      scrollTop: 1,
      addressBarHeight: (isFullscreen ? 0 : 60)
    };
  } else if (ua.match(/iphone|ipod/i)) {
    newSettings = {
      IS_MOBILE: true,
      IS_IOS: true,
      IS_IPHONE: true,
      name: "iphone",
      version: parseVersion(ua.match(/cpu iphone os ([\d_]+)/)[1], "_"),
      scrollTop: 1,
      addressBarHeight: (isFullscreen ? 0 : 60)
    };
  } else if (ua.match(/mobile|blackBerry|iemobile|kindle|netfront|silk-accelerated|(hpw|web)os|fennec|minimo|opera m(obi|ini)|blazer|dolfin|dolphin|skyfire|zune|windows\sce|palm/i)) {
    newSettings = {
      IS_MOBILE: true,
      IS_OTHER: true,
      name: "mobile-generic",
      scrollTop: 0,
      addressBarHeight: 0
    };
  } else {
    newSettings = {
      IS_OTHER: true,
      name: "desktop-browser"
    };
  }
  newSettings.IS_LEGACY_IE = ieVersion < 10;
  newSettings.IS_LEGACY_ANDROID = newSettings.IS_ANDROID && newSettings.version[0] < 4;
  newSettings.IS_LEGACY_IOS = newSettings.IS_IOS && newSettings.version[0] < 6;
  _.extend(Teseda.platform, newSettings);
  return CONFIG.routing.html5Mode = !(Teseda.platform.IS_LEGACY_ANDROID || Teseda.platform.IS_LEGACY_IE);
})();

jQuery.expr[":"].contains = function(a, i, m) {
  return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};

jQuery.fn.spin = function(opts) {
  this.each(function() {
    var $this, data;

    $this = $(this);
    data = $this.data();
    if (data.spinner) {
      data.spinner.stop();
      delete data.spinner;
    }
    if (opts !== false) {
      return data.spinner = new Spinner(opts).spin(this);
    }
  });
  return this;
};

jQuery.fn.outerHTML = function() {
  return $("<div>").append(this.eq(0).clone()).html();
};

jQuery.fn.focusEnd = function() {
  var node, range, sel, tmp;

  $(this).focus();
  tmp = $("<span />").appendTo($(this));
  node = tmp.get(0);
  range = null;
  sel = null;
  if (document.selection) {
    range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    range = document.createRange();
    range.selectNode(node);
    sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  tmp.remove();
  return this;
};

jQuery.fn.autoGrow = function() {
  return this.each(function() {
    var characterWidth, colsDefault, grow, growByRef, rowsDefault;

    colsDefault = this.cols;
    rowsDefault = this.rows;
    grow = function() {
      return growByRef(this);
    };
    growByRef = function(obj) {
      var i, lines, linesCount;

      linesCount = 0;
      lines = obj.value.split("\n");
      i = lines.length - 1;
      while (i >= 0) {
        linesCount += Math.floor((lines[i].length / colsDefault) + 1);
        --i;
      }
      if (linesCount > rowsDefault) {
        return obj.rows = linesCount + 1;
      } else {
        return obj.rows = rowsDefault;
      }
    };
    characterWidth = function(obj) {
      var temp1, temp2, tempCols;

      characterWidth = 0;
      temp1 = 0;
      temp2 = 0;
      tempCols = obj.cols;
      obj.cols = 1;
      temp1 = obj.offsetWidth;
      obj.cols = 2;
      temp2 = obj.offsetWidth;
      characterWidth = temp2 - temp1;
      obj.cols = tempCols;
      return characterWidth;
    };
    this.style.height = "auto";
    this.style.overflow = "hidden";
    this.style.width = ((characterWidth(this) * this.cols) + 6) + "px";
    this.onkeyup = grow;
    this.onfocus = grow;
    this.onblur = grow;
    return growByRef(this);
  });
};

/*
Object extensions
*/


if (typeof Object.create !== "function") {
  Object.create = function(o) {
    var F;

    F = function() {};
    F.prototype = o;
    return new F();
  };
}

if (typeof RegExp.escape !== "function") {
  RegExp.escape = function(str) {
    return (str + "").replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
  };
}

/*
Read more extension
@param textLimit (limit to truncate text to)
@param targetScrollToSelector (the selector of the container in which the view should scroll to when toggling read more link)
NOTE: This is needed because of the usage of AngularJS sanitize module and how ng-bind-html works
*/


String.prototype.readMore = function(textLimit, targetScrollToSelector) {
  var filteredText, readMoreTarget, strippedText;

  strippedText = Teseda.util.stripHTML(this);
  filteredText = "";
  if (strippedText.length > textLimit) {
    readMoreTarget = (targetScrollToSelector ? " rel=\"" + targetScrollToSelector + "\"" : "");
    filteredText = "<span class=\"read-more\">" + this + "<br/><br/><a class=\"read-more-or-less-link\"" + readMoreTarget + ">Read less</a></span>";
    filteredText += "<span class=\"read-less\">" + linkify(strippedText.substr(0, textLimit).split(/\r\n|\r|\n/).join(" <br/><br/>")) + "... <a class=\"read-more-or-less-link\"" + readMoreTarget + ">Read more</a></span>";
  } else {
    filteredText = "<span>" + this + "</span>";
  }
  return filteredText;
};

if (typeof String.prototype.trimLeft !== "function") {
  String.prototype.trimLeft = function() {
    return this.replace(/^\s\s*/, "");
  };
}

if (typeof String.prototype.trimRight !== "function") {
  String.prototype.trimRight = function() {
    return this.replace(/\s\s*$/, "");
  };
}

if (typeof String.prototype.trim !== "function") {
  String.prototype.trim = function() {
    return this.trimLeft().trimRight();
  };
}

$(document).ready(function() {
  return Teseda.prop.docReadyTime = new Date().getTime();
});
