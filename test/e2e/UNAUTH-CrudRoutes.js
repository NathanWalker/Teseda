describe("E2E: Testing CRUD Routes", function() {

  it('logout', function() {
    nav_Logout();
    sleep(2);
    pHome();
  });

  it('unauth: /1', function(){
    nav_Wrap('1');
    pForWrap('1');
  });

  it('unauth: /NathanWalker', function(){
    nav_Wrap('NathanWalker');
    pForWrap("NathanWalker");
  });

  it('unauth: /blah doesnt exist - should show a private wrap alert - 404', function(){
    nav_Wrap('blah');
    pError();
    tPrivateMessage();
  });

  it('unauth: /1/edit', function(){
    nav_Wrap_Edit('1');
    pLogin();
  });

  it('unauth: /1/blah doesnt exist - 404', function(){
    nav_Wrap('1/blah');
    pError();
  });

  it('unauth: /NathanWalker/edit', function(){
    nav_Wrap_Edit('NathanWalker');
    pLogin();
  });

  it('unauth: /1/galleries', function(){
    nav_Galleries('1');
    // doesn't exist
    pError();
  });

  it('unauth: /AndyBean/galleries', function(){
    nav_Galleries('AndyBean');
    // doesn't exist
    pError();
  });

  it('unauth: /1/gallery/1', function(){
    nav_Wrap('1/gallery/1');
    // doesn't exist
    pError();
  });

  it('unauth: /1/gallery/1/edit', function(){
    nav_Wrap('1/gallery/1/edit');
    // doesn't exist
    pError();
  });

  it('unauth: /1/gallery/1/blah - unsupported should redirect to 404', function(){
    nav_Wrap('1/gallery/1/blah');
    pError();
  });

});