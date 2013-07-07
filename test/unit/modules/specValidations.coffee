describe "Unit: Testing Module Validations", ->
  vs = undefined
  beforeEach angular.mock.module("Validations")
  beforeEach inject((ValidationService) ->
    vs = ValidationService
  )
  it "should contain an validation service", ->
    expect(vs).not.to.equal null



# it('should have a valid validation service api', function() {
#   expect(vs.msg).to.exist;
#   expect(vs.isEmail).to.exist;
#   expect(vs.hasSpace).to.exist;
# });