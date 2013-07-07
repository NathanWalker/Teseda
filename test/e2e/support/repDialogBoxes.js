// Standard buttons on all dialog boxes
    var click_backdrop = function() {
        element('.modal-backdrop.in').click();
    };

    var click_bX = function() {
        element('button[data-ng-click="modalClose($event)"]').click();
    };


// G
// Galleries
    var Di_Gallery = function() {
        expect(element('.modal.ng-scope').count()).toBe(1);
        expect(element('button[data-ng-click="modalClose($event)"]').count()).toBe(1);
        expect(element('h3:contains(Add a Gallery)').count()).toBe(1);
        expect(element('input[placeholder="Gallery name"]').count()).toBe(1);
        expect(element('input[value="Save"]').count()).toBe(1);
        expect(element('a:contains(Cancel)').count()).toBe(1);
    };

    var Di_Gallery_closed = function() {
        expect(element('h3:contains(Login using your email)').count()).toBe(0);
        expect(element('.modal.ng-scope').count()).toBe(0);
    };

 
    var type_fGalleryName = function(gallery) {
        input('$parent.resourceEdit').enter(gallery);
    };

    var verify_text_in_fGalleryName = function(gallery) {
        expect(input('$parent.resourceEdit' == gallery).count()).toBe(1);
    };


// L
// Login
    var Di_Login = function() {
        expect(element('.modal.ng-scope').count()).toBe(1);
        expect(element('button[data-ng-click="modalClose($event)"]').count()).toBe(1);
        expect(element('h3:contains(Login using your email)').count()).toBe(1);
        expect(element('input[placeholder="Username"]').count()).toBe(2);
        expect(element('input[placeholder="Password"]').count()).toBe(1);
        expect(element('input[value="Login using BizBuilt account"]').count()).toBe(1);
        expect(element('a:contains(Forgot Password?)').count()).toBe(1);
    };

    var Di_Login_closed = function() {
    	expect(element('h3:contains(Login using your email)').count()).toBe(0);
    	expect(element('.modal.ng-scope').count()).toBe(0);
    };

// N
// New Wrap
    var Di_NewWrap = function() {
        expect(element('.modal.ng-scope').count()).toBe(1);
        expect(element('button[data-ng-click="modalClose($event)"]').count()).toBe(1);
        expect(element('h3:contains(Name Your Wrap)').count()).toBe(1);
        expect(element('input[placeholder="Name Your Wrap"]').count()).toBe(1);
        expect(element('input[value="Save"]').count()).toBe(1);
        expect(element('a:contains(Cancel)').count()).toBe(1);
    };

    var Di_NewWrap_closed = function() {
    	expect(element('h3:contains(Name Your Wrap)').count()).toBe(0);
    	expect(element('.modal.ng-scope').count()).toBe(0);
    };






