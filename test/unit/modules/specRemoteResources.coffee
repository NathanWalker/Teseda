describe "Unit: Testing RemoteResources", ->
  beforeEach angular.mock.module("RemoteResources")
  it "should have a RemoteAccounts", inject((RemoteAccounts) ->
    expect(RemoteAccounts).not.to.equal null
  )
  it "should have a RemoteAccount", inject((RemoteAccount) ->
    expect(RemoteAccount).not.to.equal null
  )
  it "should have a RemoteAuthorization", inject((RemoteAuthorization) ->
    expect(RemoteAuthorization).not.to.equal null
  )
  it "should have a RemoteResetPassword", inject((RemoteResetPassword) ->
    expect(RemoteResetPassword).not.to.equal null
  )
  it "should have a RemoteProject", inject((RemoteProject) ->
    expect(RemoteProject).not.to.equal null
  )
  it "should have a RemoteProjects", inject((RemoteProjects) ->
    expect(RemoteProjects).not.to.equal null
  )
  it "should have a RemoteBookmarkProject", inject((RemoteBookmarkProject) ->
    expect(RemoteBookmarkProject).not.to.equal null
  )
  it "should have a RemoteAssetGroups", inject((RemoteAssetGroups) ->
    expect(RemoteAssetGroups).not.to.equal null
  )
  it "should have a RemoteAssets", inject((RemoteAssets) ->
    expect(RemoteAssets).not.to.equal null
  )
  it "should have a RemoteAsset", inject((RemoteAsset) ->
    expect(RemoteAsset).not.to.equal null
  )
  it "should have a RemoteTags", inject((RemoteTags) ->
    expect(RemoteTags).not.to.equal null
  )
  it "should have a RemoteGalleries", inject((RemoteGalleries) ->
    expect(RemoteGalleries).not.to.equal null
  )
  it "should have a RemoteGallery", inject((RemoteGallery) ->
    expect(RemoteGallery).not.to.equal null
  )
  it "should have a RemoteSlides", inject((RemoteSlides) ->
    expect(RemoteSlides).not.to.equal null
  )
  it "should have a RemoteMessages", inject((RemoteMessages) ->
    expect(RemoteMessages).not.to.equal null
  )
  it "should have a RemoteMessage", inject((RemoteMessage) ->
    expect(RemoteMessage).not.to.equal null
  )
  it "should have a RemoteComments", inject((RemoteComments) ->
    expect(RemoteComments).not.to.equal null
  )
  it "should have a RemoteComment", inject((RemoteComment) ->
    expect(RemoteComment).not.to.equal null
  )
  it "should have a RemoteFlag", inject((RemoteFlag) ->
    expect(RemoteFlag).not.to.equal null
  )
  it "should have a RemoteRequest", inject((RemoteRequest) ->
    expect(RemoteRequest).not.to.equal null
  )
  it "should have a RemoteProjectsNearby", inject((RemoteProjectsNearby) ->
    expect(RemoteProjectsNearby).not.to.equal null
  )
  it "should have a RemoteToken", inject((RemoteToken) ->
    expect(RemoteToken).not.to.equal null
  )
  it "should have a RemoteConnections", inject((RemoteConnections) ->
    expect(RemoteConnections).not.to.equal null
  )
  it "should have a RemoteConnectionsSync", inject((RemoteConnectionsSync) ->
    expect(RemoteConnectionsSync).not.to.equal null
  )
  it "should have a RemoteSearch", inject((RemoteSearch) ->
    expect(RemoteSearch).not.to.equal null
  )
