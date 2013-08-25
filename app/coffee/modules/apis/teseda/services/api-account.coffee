angular.module("TesedaApi")
  .factory("TesedaApiAccountService", ['LogService', '$rootScope', '$q', 'ResourceService', 'TesedaValidationService', 'StaticTextService', (log, $rootScope, $q, rs, validate, statictext) ->
    base = 'accounts'
    remoteKey = 'account'

    api = {}

    api.pre = (crudType, options) ->
      defer = $q.defer()
      data =
        account:options.data
      switch crudType
        when 'get' then defer.resolve(url: [base, options.id])
        when 'save'
          if validate.account.email(data.account.email) and validate.account.password(data.account.password)
            defer.resolve(url: [base], data: data)
        when 'update' then defer.resolve(url:[base, options.id], data: data)

      return defer.promise

    api.post = (crudType, result) ->
      defer = $q.defer()
      data = result.data[remoteKey]
      if data
        $rootScope.$broadcast(rs.events.account[crudType], data)
        defer.resolve(data)
      else
        $rootScope.$broadcast(rs.events.error, result)
        if result.errors and result.errors.login
          $rootScope.alert(statictext.validation.account.loginAlreadyTaken('email'))
        defer.reject(result)
      return defer.promise

    api
  ])
