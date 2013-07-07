angular.module(Product.resource.module).factory("TesedaValidationService", [
  "" + Product.resource.module + ".config", "LogService", "StaticTextService", "$rootScope", function(config, log, statictext, $rootScope) {
    var api, hasSpace, isEmail, logId, msg;

    logId = "TesedaValidationService";
    msg = function(msg) {
      if (config.validations.enabled) {
        log(msg, logId);
        if (config.validations.showAlertOnFailure) {
          $rootScope.alert(msg);
        }
      }
      return false;
    };
    isEmail = function(value) {
      return !_.isEmpty(value) && value.match(Teseda.regex.email);
    };
    hasSpace = function(value) {
      return value.match(/[ ]/);
    };
    api = {
      account: {
        login: function(value, compareValue) {
          if (_.isEmpty(value)) {
            return msg(statictext.validation.account.loginBlank);
          } else if (hasSpace(value)) {
            return msg(statictext.validation.account.loginSpace);
          } else if (isEmail(value) && compareValue && value !== compareValue) {
            return msg(statictext.validation.account.loginMatch);
          } else {
            return true;
          }
        },
        email: function(value) {
          if (!isEmail(value)) {
            return msg(statictext.validation.general.email);
          } else {
            return true;
          }
        },
        password: function(value, compareValue) {
          if (_.isEmpty(value)) {
            return msg(statictext.validation.account.passwordBlank);
          } else if (value.length > 0 && value.length < 6) {
            return msg(statictext.validation.account.passwordLength);
          } else if (value.length > 0 && !value.match(/\d/)) {
            return msg(statictext.validation.account.passwordNeedNumber);
          } else if (compareValue && value !== compareValue) {
            return msg(statictext.validation.account.passwordMatch);
          } else {
            return true;
          }
        }
      }
    };
    return api;
  }
]);
