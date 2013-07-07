/*
  Teseda Resource
  api.teseda.com resource wrapper
*/
angular.module("" + Product.resource.module + ".config", []);

angular.module(Product.resource.module, ["Logger", "" + Product.resource.module + ".config", "Resource", "StaticText", "Modal"]).factory(Product.resource.helper, [
  'LogService', 'ResourceService', Product.resource.service("Account"), function(log, rs, account) {
    var api, resources;

    resources = ['account'];
    api = {};
    api.getServiceForType = function(type) {
      switch (type) {
        case 'account':
          return account;
      }
    };
    api.init = function() {
      return rs.register(api, Product.apiId, resources, true);
    };
    return api;
  }
]);
