describe("Midway: Modules", function() {
  describe("App:", function() {

    var mod, $injector, dependencies;

    dependencies = [
      "Logger",
      "LoadingSpinner",
      "ErrorMsgs",
      "LocalStorage",
      "AppControllers",
      "AppDirectives",
      "AppServices",
      "AppFilters",
      "AppRoutes",
      "User",
      "Assets",
      "UXTracking",
      "ngMobile",
      "ngSanitize",
      "ui",
      "ui.bootstrap",
      "ngGrid",
      "responsive",
      "ElementResizer",
      "hmTouchevents",
      "AppCache",
      "Network",
      "Validations",
      "AppSettings",
      "Modal",
      "Search",
      "RemoteResources",
      "Breadcrumbs",
      "OAuth",
      "StaticText"
    ];

    before(function(done) {
      mod = angular.module("App");
      ngMidwayTester.register('App', function(instance) {
        test = instance;
        $injector = test.$injector;
        done();
      });
    });

    it("should be registered", function() {
      expect(mod).not.to.equal(null);
    });

    describe("Dependencies:", function() {

      var deps;
      var hasModule = function(m) {
        return deps.indexOf(m) >= 0;
      };
      before(function() {
        deps = mod.value('appName').requires;
      });

      it("should have correct dependencies", function() {
        expect(deps).to.eql(dependencies);
      });

      _.forEach(dependencies, function(dependency){
        it("should have " + dependency + " as a dependency", function() {
          expect(hasModule(dependency)).to.equal(true);
        });
      });

    });

    describe("CONSTANTS:", function() {

      it("FAKE_MOBILE", function() {
        expect($injector.get('FAKE_MOBILE')).to.equal(false);
      });

      it("GOOGLE_MAPS_ENABLED", function() {
        expect($injector.get('GOOGLE_MAPS_ENABLED')).to.equal(true);
      });

    });
  });
});
