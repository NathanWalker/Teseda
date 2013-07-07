describe("E2E: Testing CORE Routes", function() {

  it('unauth: navigating to login', function() {
      nav_Login();
      pLogin();
  });

  it('unauth: navigating to login?p=forgot', function() {
      nav_ForgotPassword();
      pForgotPassword();
  });

  it('unauth: navigating to logout', function() {
      nav_Logout();
      pHome();
  });

  it('unauth: navigating to private_browsing', function() {
      nav_PrivateBrowsing();
      pPrivateBrowsing();
  });

  it('unauth: /wraps', function(){
      nav_Wrap();
      pWraps();
  });

  it('unauth: /new', function(){
      nav_New();
      pNewWrap();
  });

  it('unauth: /edit', function(){
      pEdit();
      pLogin();
  });

  it('unauth: navigating to unknown route gets 404', function() {
    // NOTE: This requires api to be running (ensure you have 'rails s' running from api)

    // This will attempt to find card by this name, if none found, then page not found.
      nav_Wrap('blah');
      pError();
  });

  it('ensure development routes do not work! They should not work in production environment.', function() {
    // NOTE: This requires api to be running (ensure you have 'rails s' running from api)

    // This will attempt to find card by this name, if none found, then page not found.
      nav_Wrap('wireframe');
      pError();
  });
});