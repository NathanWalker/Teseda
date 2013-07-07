// Elements on page Login, Home page and Forgot Your password page
// Test Steps for page Login, Home page and Forgot Your password page


// Buttons
    var click_bEmail = function() {
        element('span[data-icon="email"]').click();;
    };

    var click_bLogin = function(){
        element('input[value="Login using BizBuilt account"]').click();
        sleep(1);
    };

// Caption
// Checkbox
// Drop Down List
// Fields
    var type_fUsername = function(user){
        input('userInputAccount.login').enter(user);
    };

    var type_fPassword = function(pass){
        input('userInputAccount.password').enter(pass);
    };

// Image
// Logo
// Links
    var click_lForgotPassword = function() {
        element('a:contains(Forgot Password?)').click();
    };

    var verify_Wrap_Displayed = function(name) {
        expect(element('div[x-title="You are currently operating as " + "(name)" + " "]').count()).toBe(1);
    };

// Menu
// Radiobutton
// Section
// Sub Menu
// Tabs
// Text


// Functions (Test cases with more than one element)
    var log_into_infoWrap = function(user, pass, name, n) {
        click_bEmail();
        Di_Login();
        type_fUsername(user);
        type_fPassword(pass);
        click_bLogin();
        pMyWraps(name, n);
    };

    var log_in_as_scottb = function() {
        log_into_infoWrap('scottb', 'mario1', 'Scott Bruun');
    };

    var log_in_as_scottc = function() {
        log_into_infoWrap('scottc', 'mario1', 'Scott Clum');
    };

    var log_in_as_scottw = function() {
        log_into_infoWrap('scottw', 'mario1', 'Scott Westenskow');
    };



