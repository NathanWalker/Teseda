
###
  Teseda Resource
  api.teseda.com resource wrapper
###

angular.module("#{Product.resource.module}.config", [])
angular.module(Product.resource.module, ["Logger", "#{Product.resource.module}.config", "Resource", "StaticText", "Modal"])
  .factory(Product.resource.helper, [
    'LogService',
    'ResourceService',
    Product.resource.service("Account"),
    (
      log,
      rs,
      account) ->

      resources = [
        'account'
      ]

      api = {}

      api.getServiceForType = (type) ->
        switch type
          when 'account' then account

      # init
      api.init = () ->
        # register with standard resource service
        rs.register(api, Product.apiId, resources, true)

      api
  ])
