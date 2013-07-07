
describe("Midway: Testing Services", function() {

  var test, onChange, $injector;

  before(function(done) {
    ngMidwayTester.register('App', function(instance) {
      test = instance;
      done();
    });
  });

  before(function() {
    test.$rootScope.$on('$routeChangeSuccess', function() {
      if(onChange) onChange();
    });
  });

  before(function() {
    $injector = test.injector();
  });

  beforeEach(function() {
    //test.reset();
  });

  it('should be able to create a local storage item, which in turn publishes the item on $rootScope', function(done) {
    var ls = $injector.get('LocalStorageService');
    expect(ls).not.to.equal(null);

    ls.create('TestThis', {something:'should be something'},function(data) {
      expect(data).not.to.equal(null);
      expect(data.something).to.equal('should be something');
      expect(test.$rootScope.TestThis).to.eql({ something: 'should be something' });
      expect(test.$rootScope.TestThis.something).to.equal('should be something');
      done();
    });
  });

  it('after creating a local storage item, saving to $rootScope[item] should auto-save to local storage', function(done) {
    var ls = $injector.get('LocalStorageService');
    expect(ls).not.to.equal(null);

    test.$rootScope.TestThis.something = 'is now something else';
    test.$rootScope.$apply();

    ls.getAll('TestThis', function(data) {
      expect(data).not.to.equal(null);
      expect(data.something).to.equal('is now something else');
      done();
    });
  });

  it('should be able to save data to the local storage item', function(done) {
    var ls = $injector.get('LocalStorageService');
    expect(ls).not.to.equal(null);
    expect(test.$rootScope.TestThis).to.eql({ something: 'is now something else' }); // from above change

    ls.save('TestThis', {something:'should be something'},function(data) {
      expect(data).not.to.equal(null);
      expect(data.something).to.equal('should be something');
      done();
    });
  });

  it('should be able to get all data from local storage', function(done) {
    var ls = $injector.get('LocalStorageService');
    expect(ls).not.to.equal(null);

    ls.getAll('TestThis', function(data) {
      expect(data).not.to.equal(null);
      expect(data.something).to.equal('should be something');
      done();
    });
  });

  it('should be able to get specific data property from local storage item', function(done) {
    var ls = $injector.get('LocalStorageService');
    expect(ls).not.to.equal(null);

    ls.get('TestThis', 'something', function(data) {
      expect(data).not.to.equal(null);
      expect(data).to.equal('should be something');
      done();
    });
  });

  it('should be able to get reset local storage item', function(done) {
    var ls = $injector.get('LocalStorageService');
    expect(ls).not.to.equal(null);

    ls.reset('TestThis', function(data) {
      expect(data).to.equal(undefined);
      expect(test.$rootScope.TestThis).to.equal(undefined);

      ls.getAll('TestThis', function(data) {
        expect(data).to.equal(undefined);
        done();
      });
    });
  });

});
