describe "Unit: HomeCtrl ", ->
  http = undefined
  ctrl = undefined
  rootScope = undefined
  loc = undefined
  beforeEach angular.mock.module("App")
  beforeEach inject(($rootScope, $controller, $httpBackend, $location) ->
    rootScope = $rootScope
    ctrl = $controller
    http = $httpBackend
    loc = $location
  )
  it "prelim test", ->
    s = rootScope.$new()
    ctrl "HomeCtrl",
      $scope: s

    rootScope.isAuthenticated = false
    rootScope.$apply()
    expect(loc.url()).to.equal "/"
    expect(s.authView).to.equal "views/site/login.html"
    
    # cannot test value (in fact it will be false because the view declares ng-controller, and viewReady only flags true when LoginCtrl or DashboardCtrl initialize)
    expect(s.viewReady).to.equal false

  it "when authenticated, should redirect to '/' but should switch authView", ->
    s = rootScope.$new()
    ctrl "HomeCtrl",
      $scope: s

    rootScope.isAuthenticated = true
    rootScope.currentUser =
      id: 1
      name: "test"
      cards: [
        id: 1
        name: "test"
      ]

    rootScope.$apply()
    expect(loc.url()).to.equal "/"
    expect(s.authView).to.equal "views/project/dashboard.html"
    
    # this will, in fact, be false (in unit test) because the view declares ng-controller, and viewReady only flags true when LoginCtrl or DashboardCtrl initialize)
    expect(s.viewReady).to.equal false