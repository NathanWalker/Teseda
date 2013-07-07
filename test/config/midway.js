var path = require('path');
shared = require(path.resolve('test/config', './shared.js')).shared

basePath = '../../';

files = shared.files.concat([
  MOCHA,
  MOCHA_ADAPTER,
  'test/config/mocha.conf.js',

  //Test-Specific Code
  'vendor/js/ngMidwayTester/Source/ngMidwayTester.js',

  //Test-Specs
  'test/midway/**/*.js'
]);


port = 9202;
runnerPort = 9302;
captureTimeout = 10000;

growl     = shared.colors;
colors    = shared.colors;
singleRun = shared.singleRun;
autoWatch = shared.autoWatch;
browsers  = shared.defaultBrowsers;
reporters = shared.defaultReporters;
proxies   = shared.defaultProxies;
preprocessors = shared.preprocessors;
plugins = shared.plugins;
