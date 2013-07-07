Product =
  name:"Teseda"
  apiId:"teseda-v1"

# every product has remote resources
# this helps standardize naming conventions when dealing with them and integrating them into any product
Product.resource =
  module:"#{Product.name}Resource"
  service:(resourceName) ->
    "#{Product.name}#{resourceName}Service"

Product.resource.config = "#{Product.resource.module}.config"
Product.resource.helper = "#{Product.resource.module}Helper"
