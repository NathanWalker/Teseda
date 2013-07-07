var Product;

Product = {
  name: "Teseda",
  apiId: "teseda-v1"
};

Product.resource = {
  module: "" + Product.name + "Resource",
  service: function(resourceName) {
    return "" + Product.name + resourceName + "Service";
  }
};

Product.resource.config = "" + Product.resource.module + ".config";

Product.resource.helper = "" + Product.resource.module + "Helper";
