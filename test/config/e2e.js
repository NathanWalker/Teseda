var path = require('path');
shared = require(path.resolve('test/config', './shared.js')).shared

basePath = '../../';

files = [
  ANGULAR_SCENARIO,
  ANGULAR_SCENARIO_ADAPTER,
  'test/lib/custom-e2e-steps.js',
  'test/lib/custom-mocks.js',
  'test/e2e/**/*.js'
];

port = 9203;
runnerPort = 9303;
captureTimeout = 10000;

growl     = shared.colors;
colors    = shared.colors;
singleRun = shared.singleRun;
autoWatch = shared.autoWatch;
browsers  = shared.defaultBrowsers;
reporters = shared.defaultReporters;
proxies   = shared.defaultProxies;
