describe("Midway: Modules", function() {
  describe("AppSettings:", function() {

    var mod, mod_config, $injector, dependencies;

    dependencies = [
      "AppSettings.config",
      "Logger",
      "LocalStorage"
    ];

    before(function(done) {
      mod = angular.module("AppSettings");
      ngMidwayTester.register('AppSettings', function(instance) {
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

    describe("verify valid api exists", function() {

      it("api methods", function() {
        var appSettingService = $injector.get('AppSettingsService');
        expect(appSettingService.init).to.exist;
      });

    });
  });
});