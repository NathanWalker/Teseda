describe("Testing CRUD Routes", function() {

  var test, onChange;

  before(function(done) {
    ngMidwayTester.register('App', function(instance) {
      test = instance;
      done();
    });
  });

  it("should have a project_catchAll_path", function() {
    var route = ROUTER.getRoute('project_catchAll_path');
    route.params.controller.should.equal('ProjectCtrl');
    var url = ROUTER.routePath('project_catchAll_path');
    expect(url).to.equal('/:projectId');
  });

  it("should have a project_catchAll_page_path", function() {
    var route = ROUTER.getRoute('project_catchAll_page_path');
    route.params.controller.should.equal('ProjectCtrl');
    var url = ROUTER.routePath('project_catchAll_page_path');
    expect(url).to.equal('/:projectId/:page');
  });

});