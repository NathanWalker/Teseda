var path = require('path');
shared = require(path.resolve('test/config', './shared.js')).shared

basePath = '../../';

files = shared.files.concat([
  MOCHA,
  MOCHA_ADAPTER,
  'test/config/mocha.conf.js',

  //Test-Specific Code
  'test/lib/angular/angular-mocks.js',

  //Test-Specs
  'test/unit/**/spec*.js',

  //Mock data
  'test/unit/mockData.js'
]);

port = 9201;
runnerPort = 9301;
captureTimeout = 10000;

growl     = shared.colors;
colors    = shared.colors;
singleRun = shared.singleRun;
autoWatch = shared.autoWatch;
browsers  = shared.defaultBrowsers;
reporters = shared.defaultReporters;
preprocessors = shared.preprocessors;
plugins = shared.plugins;
