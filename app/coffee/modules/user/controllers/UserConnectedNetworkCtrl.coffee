angular.module("User").controller("UserConnectedNetworksCtrl", ["LogService", "$scope", "$rootScope", "$timeout", "StaticTextService", "OAuthService", (log, s, $rootScope, $timeout, statictext, oauth) ->
  logId = "UserConnectedNetworksCtrl"

  toggling = false
  s.toggleProvider = (provider) ->
    log(provider)
    unless toggling
      toggling = true
      if provider.checked
        oauth.deauthorize(provider.id).then (data) ->
          if data.errors
            return false

          providerCount--
          provider.checked = provider.checkedBound = false

          if providerCount is 0
            $rootScope.alert statictext.accountSettings.thirdPartyNotice
      else
        $rootScope.$broadcast Teseda.scope.events.site.showLoading
        oauth.authorize(provider, $rootScope.currentUser.auth_token)
      $timeout ->
        # prevent erroneous double-clicks
        toggling = false
      , 500

  providerCount = 0
  s.providers = []

  oauth.getAuthorizedList().then (data) ->
    currentProviders = {}

    _.forEach data.authorizations, (auth) ->
      # we need to track 2 states for checked because of the usability around checkboxes and how data-binding works with them
      # if user clicks the checkbox itself, the ng-model will update the bound property and the logic above will go through the wrong condition
      # however if the user clicks the title, it will go through the right condition because the ng-model will have not been touched
      # so we need to have a state that is independent of the ng-model for our logic in toggleProvider to work properly
      currentProviders[auth.provider] =
        id: auth.id
        checked:true
        checkedBound: true
      providerCount++

    _.forEach oauth.providers(), (provider, key) ->
      s.providers.push(_.extend({name: key + '-1'}, provider, currentProviders[key]))

  log('init()', logId)
])
