/*
CONFIG helper class
*/

var CONFIG;

CONFIG = void 0;

(function() {
  var appVersion, viewDevelopmentUrlPrefix, viewUrlPrefix;

  viewUrlPrefix = "views/";
  viewDevelopmentUrlPrefix = "fixtures/views/";
  appVersion = "0.0.1";
  return CONFIG = {
    version: appVersion,
    routing: {
      prefix: "!",
      html5Mode: false,
      authorizedRoutes: [],
      /*
      DEVELOPMENT ROUTES
      To try out a view, add a .html file into: fixtures/views/
      Then edit app/fixtures/js/development.js, views collection with name of file
      
      Default View Controller: HomeCtrl
      */

      viewsInDevelopment: (typeof developmentJS !== "undefined" ? developmentJS.views : false),
      /*
      routes.js
      
      Helps with testing out data structures, etc.
      */

      resourceRemoteUrlFor: function(resource) {
        if (typeof developmentJS !== "undefined") {
          return "fixtures/json/" + resource + ".json";
        }
      }
    },
    viewDirectory: viewUrlPrefix,
    viewDevelopmentDirectory: viewDevelopmentUrlPrefix,
    viewFileSuffix: ".html",
    prepareViewUrl: function(url, useDevelopment, viewLocation) {
      if (useDevelopment) {
        return this.viewDevelopmentDirectory + (viewLocation || url) + this.viewFileSuffix;
      } else {
        return this.viewDirectory + url + this.viewFileSuffix;
      }
    }
  };
})();
