angular.module(Product.resource.module).factory(Product.resource.service('Account'), [
  'LogService', '$rootScope', '$q', 'ResourceService', 'TesedaValidationService', 'StaticTextService', function(log, $rootScope, $q, rs, validate, statictext) {
    var api, base, remoteKey;

    base = 'accounts';
    remoteKey = 'account';
    api = {};
    api.pre = function(crudType, options) {
      var data, defer;

      defer = $q.defer();
      data = {
        account: options.data
      };
      switch (crudType) {
        case 'get':
          defer.resolve({
            url: [base, options.id]
          });
          break;
        case 'save':
          if (validate.account.email(data.account.email) && validate.account.password(data.account.password)) {
            defer.resolve({
              url: [base],
              data: data
            });
          }
          break;
        case 'update':
          defer.resolve({
            url: [base, options.id],
            data: data
          });
      }
      return defer.promise;
    };
    api.post = function(crudType, result) {
      var data, defer;

      defer = $q.defer();
      data = result.data[remoteKey];
      if (data) {
        $rootScope.$broadcast(rs.events.account[crudType], data);
        defer.resolve(data);
      } else {
        $rootScope.$broadcast(rs.events.error, result);
        if (result.errors && result.errors.login) {
          $rootScope.alert(statictext.validation.account.loginAlreadyTaken('email'));
        }
        defer.reject(result);
      }
      return defer.promise;
    };
    return api;
  }
]);
