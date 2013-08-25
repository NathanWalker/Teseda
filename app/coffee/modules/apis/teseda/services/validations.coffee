angular.module("TesedaApi").factory "TesedaValidationService", ["TesedaApi.config", "LogService", "StaticTextService", "$rootScope", (config, log, statictext, $rootScope) ->
  logId = "TesedaValidationService"

  msg = (msg) ->
    if config.validations.enabled
      log msg, logId
      if config.validations.showAlertOnFailure
        $rootScope.alert(msg)
    false

  isEmail = (value) ->
    not _.isEmpty(value) and value.match(Teseda.regex.email)

  hasSpace = (value) ->
    value.match(/[ ]/)

  api =
    account:
      login: (value, compareValue) ->
        if _.isEmpty(value)
          msg(statictext.validation.account.loginBlank)
        else if hasSpace(value)
          msg(statictext.validation.account.loginSpace)
        else if isEmail(value) and compareValue and value isnt compareValue
          msg(statictext.validation.account.loginMatch)
        else
          true
      email: (value) ->
        if not isEmail(value)
          msg(statictext.validation.general.email)
        else
          true
      password: (value, compareValue) ->
        if _.isEmpty(value)
          msg(statictext.validation.account.passwordBlank)
        else if value.length > 0 and value.length < 6
          msg(statictext.validation.account.passwordLength)
        else if value.length > 0 and not value.match(/\d/)
          msg(statictext.validation.account.passwordNeedNumber)
        else if compareValue and value isnt compareValue
          msg(statictext.validation.account.passwordMatch)
        else
          true

  api
]
