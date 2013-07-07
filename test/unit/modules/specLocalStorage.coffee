describe "Unit: Testing LocalStorage", ->
  ls = undefined
  beforeEach angular.mock.module("LocalStorage")
  beforeEach inject((LocalStorageService) ->
    ls = LocalStorageService
  )
  it "should contain an LocalStorage service", ->
    expect(ls).not.to.equal null

  it "should have a valid LocalStorage api", ->
    expect(ls.privateBrowsingEnabled).to.equal false
    expect(ls.privateBrowsingMsg).to.equal "It appears you may have cookies disabled. To use InfoWrap, please ensure cookies are enabled in your browser."
    expect(ls.save).to.exist
    expect(ls.getAll).to.exist
    expect(ls.get).to.exist
    expect(ls.reset).to.exist
    expect(ls.create).to.exist

