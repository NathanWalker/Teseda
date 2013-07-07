angular.module("User").controller("UserSettingsCtrl", [
  "LogService", "$scope", "$rootScope", "$filter", "$timeout", "$location", "InfowrapValidationService", "ResourceService", "StaticTextService", "UserService", function(log, s, $rootScope, $filter, $timeout, $location, validate, rs, statictext, userService) {
    var controlUpdateButton, logId;

    logId = "UserSettingsCtrl";
    s.updateButtonEnabled = false;
    controlUpdateButton = function() {
      var currentUser;

      currentUser = $rootScope.currentUser;
      if (s.userInputAccount.name !== currentUser.name || s.userInputAccount.login !== currentUser.login || s.userInputAccount.email !== currentUser.email || (s.userInputAccount.password && s.userInputAccount.password === s.userInputAccount.password_confirmation)) {
        return s.updateButtonEnabled = true;
      } else {
        return s.updateButtonEnabled = false;
      }
    };
    s.userInputAccount = _.clone($rootScope.currentUser, true);
    s.resetPassword = function(input) {
      var account, options;

      log(input);
      if (validate.account.login(input.login) && validate.account.email(input.email)) {
        if (!_.isEmpty(input.password && !validate.account.password(input.password, input.password_confirmation))) {
          return;
        }
        s.updateButtonEnabled = false;
        account = {
          name: input.name,
          login: input.login,
          email: input.email
        };
        if (input.password) {
          _.extend(account, {
            password: input.password
          });
        }
        options = {
          id: $rootScope.currentUser.id,
          data: account,
          type: 'account'
        };
        return rs.update(options);
      }
    };
    s.$watch('userInputAccount', function() {
      return controlUpdateButton();
    }, true);
    s.$on(rs.events.account.update, function(e, result) {
      s.userInputAccount.password = '';
      return s.userInputAccount.password_confirmation = '';
    });
    return log('init()', logId);
  }
]);
