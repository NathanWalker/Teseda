angular.module("User").controller("UserSettingsCtrl", ["LogService", "$scope", "$rootScope", "$filter", "$timeout", "$location", "InfowrapValidationService", "ResourceService", "StaticTextService", "UserService", (log, s, $rootScope, $filter, $timeout, $location, validate, rs, statictext, userService) ->
  logId = "UserSettingsCtrl"

  s.updateButtonEnabled = false

  controlUpdateButton = () ->
    currentUser = $rootScope.currentUser
    if s.userInputAccount.name isnt currentUser.name or s.userInputAccount.login isnt currentUser.login or s.userInputAccount.email isnt currentUser.email or (s.userInputAccount.password and s.userInputAccount.password is s.userInputAccount.password_confirmation)
      s.updateButtonEnabled = true
    else
      s.updateButtonEnabled = false

  s.userInputAccount = _.clone($rootScope.currentUser, true)

  s.resetPassword = (input) ->
    log input
    if validate.account.login(input.login) and validate.account.email(input.email)
      if not _.isEmpty input.password and not validate.account.password(input.password, input.password_confirmation)
        return;

      s.updateButtonEnabled = false
      account =
        name: input.name
        login: input.login
        email: input.email

      # only update password if they entered one
      _.extend account, { password: input.password} if input.password
      options =
        id: $rootScope.currentUser.id
        data: account
        type: 'account'

      rs.update(options)


  # WATCHERS
  s.$watch 'userInputAccount', () ->
    controlUpdateButton()
  , true

  # EVENTS
  s.$on rs.events.account.update, (e, result) ->
    # reset password inputs
    s.userInputAccount.password = '';
    s.userInputAccount.password_confirmation = '';

  log('init()', logId)
])
