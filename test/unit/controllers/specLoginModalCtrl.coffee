describe "Unit testing the LoginModalCtrl;", ->
  currentFile = "LoginModalCtrl"
  mds = s = rootScope = data = http = undefined
  beforeEach angular.mock.module("App")
  beforeEach angular.mock.module("MockData")
  
  beforeEach inject(($rootScope, $httpBackend, MockDataService) ->
    mds = MockDataService
    data = mds.data.LoginModalCtrl.defaultAccount
    http = $httpBackend
    # http.expectPOST('http://localhost:3000/v1/login.json').respond(data)
    rootScope = $rootScope
    s = mds.initCtrl currentFile, data
  )

  it "injected services should be available", ->
    expect(mds).to.exist

  it "all scoped variables and functions should be registered", ->
    expect(s.login).to.exist

  it "all rootScoped variables and functions accessed by this controller should be registered", ->
    # expect(rootScope.RequireRemoteAuthentication).to.exist
    # expect(rootScope.AppSettings.recentUsername).to.exist

  it "should have the proper amount of scope elements", ->
    scopeObjects = Object.keys(s)
    count = 0;
    _.forEach scopeObjects, (key) ->
      unless _.contains((key), "$") or (key is 'this')
        count++
    expect(count).to.equal(1)

  it "all event listeners should be registered", ->
    eventsThatShouldBeThere = ['']
    _.forEach Object.keys(s.$$listeners), (key) ->
      expect(_.contains(eventsThatShouldBeThere, key)).to.equal(true)

  it "should make an http call with the right credentials and return a promise", ->
    returnedData = s.login(mds.data.LoginModalCtrl.defaultLogin)
    expect(returnedData.then).to.exist
    