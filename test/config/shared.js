var shared = {};
shared.frameworks = ['jasmine'];
shared.singleRun = false;
shared.autoWatch = true;
shared.colors    = true;
shared.growl     = true;

shared.files     = [
  //3rd Party Code
  "vendor/js/utils/es5-shim.min.js",
  "vendor/js/utils/json3.min.js",
  "vendor/js/jquery/jquery-1.9.1.min.js",
  "vendor/js/utils/*.js",
  "vendor/js/jquery/jquery.scrollIntoView.js",
  "vendor/js/jquery/select2.js",
  "vendor/js/jquery/code.photoswipe.jquery-3.0.5-bbcustomized.min.js",
  "vendor/js/jquery/jquery.ba-outside-events.min.js",
  "vendor/js/swipe/*.js",
  "vendor/js/angular/angular.min.js",
  "vendor/js/angular/angular-resource.min.js",
  "vendor/js/angular/angular-sanitize.min.js",
  "vendor/js/angular/angular-mobile.js",
  "vendor/js/angular-ui/ui-utils/modules/*.js",
  "vendor/js/angular-ui/ui-utils/utils.js",
  "vendor/js/angular-ui/ng-grid.js",
  "vendor/js/angular-ui/ui-bootstrap-0.4.0-bbcustomized.js",
  "vendor/js/angular-ui/ui-map.js",
  "vendor/js/angular-ui/ui-select2.js",
  "vendor/js/hammer/*.js",
  "vendor/js/local-storage/lawnchair-0.6.1-bbcustomized.js",

  //App-specific Code
  'app/js/config/design.js',
  'app/js/config/config.js',
  'app/js/config/router.js',
  'app/js/config/bizbuilt.js',
  'app/js/modules/**/*.js',
  'app/js/controllers/**/*.js',
  'app/js/directives/**/*.js',
  'app/js/filters/**/*.js',
  'app/js/services/**/*.js',
  'app/js/app.js',

  //Test-Specific Code
  'node_modules/chai/chai.js',
  'test/lib/sinon-1.6.0.js',
  'test/lib/chai-should.js',
  'test/lib/chai-expect.js',
];

shared.preprocessors = {
  '**/*.coffee': 'coffee'
};
shared.defaultReporters = ['progress'];
shared.defaultBrowsers = ['Chrome'];
shared.defaultProxies = {
  '/': 'http://localhost:8000'
};
shared.plugins = [
  'karma-jasmine',
  'karma-chrome-launcher',
  'karma-firefox-launcher',
  'karma-junit-reporter'
];

module.exports.shared = shared;
