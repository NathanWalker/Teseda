
###
  AngularJS Module

  @title      : Logger
  @description: give your application an easy logging system for debugging or other purposes

  @version v0.0.1 - 2013-03-21
  @link http://dev.bizbuilt.com/angular/modules/Logger
  @license MIT License, http://www.opensource.org/licenses/MIT
  Depends on:
   http://docs.angularjs.org/api/ngMock.$log

  Logger.config options:
   debug       : enable/disable logging
###
angular.module('Logger.config', []).value('Logger.config', {})
angular.module('Logger', ['Logger.config']).factory('LogService', ['$log', 'Logger.config', ($log, config) ->

  return (msg, logId, type) ->
    if type is 'error' or config.debug
      msg = if logId then (logId + ': ' + msg) else msg
      $log[if type then type else 'log'] msg
])
