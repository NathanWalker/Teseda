
###
  Teseda Resource
  api.teseda.com resource wrapper
###

angular.module("TesedaApi.config", [])
angular.module("TesedaApi", ["Logger", "TesedaApi.config", "Resource", "StaticText", "Modal"])
  .factory(Product.resource.helper, [
    'LogService',
    'ResourceService',
    'TesedaApiAccountService',
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
        rs.register(api, 'teseda-v1', resources, true)

      api
  ])
