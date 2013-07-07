describe "Unit: LoginCtrl ", ->
  http = undefined
  ctrl = undefined
  rootScope = undefined
  global = undefined
  beforeEach angular.mock.module("App")
  beforeEach inject(($rootScope, $controller, $httpBackend) ->
    rootScope = $rootScope
    ctrl = $controller
    http = $httpBackend
  )
  it "prelim test", ->
    s = rootScope.$new()
    ctrl "LoginCtrl",
      $scope: s

    expect(s.resetPassword).to.exist
    expect(s.providerLogin).to.exist
    expect(s.providers).to.eql BizBuilt.thirdParties