 	beforeEach(function(){
        browser().navigateTo('/logout');
        expect(browser().location().url()).toBe("/");
        window.innerWidth = screen.width;
        window.innerHeight = screen.height;
        window.screenX = 500;
        window.screenY = 500;
        alwaysLowered = false;
    });