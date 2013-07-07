// 00
    var pError = function() {
        expect(browser().location().url()).toBe("/_404");
    };

// A
// Account
    var nav_Account = function(n) {
        browser().navigateTo('/account/' + n);
    };

    var pAccount = function(n) {
        expect(browser().location().url()).toBe('/account/' + n);
    };


// B
// Bookmarks
    var nav_Bookmarks = function() {
        browser().navigateTo('/wraps/bookmarks');
        sleep(1);
    };

    var pBookmarks = function() {
        expect(browser().location().url()).toBe("/wraps/bookmarks");
        expect(using('.breadcrumb').element('a:contains(Bookmarks):visible').count()).toBe(1);
        expect(using('.content').element('input[data-placeholder="Search"]').count()).toBe(2);
        expect(using('.content').element('button:contains(Name)').count()).toBe(1);
    };


// C
// Connetions
    var nav_Connections = function() {
        browser().navigateTo('/wraps/connections');
    };

    var pConnections = function() {
        expect(browser().location().url()).toBe("/wraps/connections");
        expect(using('.breadcrumb').element('a:contains(Connections):visible').count()).toBe(1);
        expect(using('.content').element('input[data-placeholder="Search"]').count()).toBe(2);
        expect(using('.content').element('button:contains(Name)').count()).toBe(1);
    };


// D
// Dashboard & My Wraps
    var nav_Dashboard = function() {
        browser().navigateTo('/dashboard');
    };

    var pDashboard = function(name) {
        expect(browser().location().url()).toBe("/");
        expect(element('h1:contains(' + name + ')'));

    };


// E
// Edit
    var nav_Edit = function() {
        browser().navigateTo('/edit');
    };

    var pEdit = function() {
        expect(browser().location().path()).toBe("/edit");
    };


// F
// Forgot Password
    var nav_ForgotPassword = function() {
        browser().navigateTo('/login?p=forgot');
    };

    var pForgotPassword = function() {
        expect(browser().location().url()).toBe("/login?p=forgot");
        expect(element('userInputAccount.login').count()).toBe(1);
        expect(element('account_session[login]').count()).toBe(1);
        expect(element('input[value="Send Email"]').count()).toBe(1);
        expect(element('a:contains(Login)').count()).toBe(1);
    };


// G
// Galleries
    var nav_Galleries = function(nam) {
        browser().navigateTo('/' + nam + '/galleries');
    };

    var pGallery = function(nam) {
        expect(element('h1:contains(' + name + ')'));
        expect(element('.poster').count()).toBe(3);
        expect(element('.avatar').count()).toBe(3);
        expect(element('div[data-icon="share"]').count()).toBe(1);
        expect(element('a:contains(Back to Wrap Home').count()).toBe(1);
    };


// H
// Home
    var nav_Home = function() {
        browser().navigateTo('/');
        sleep(1);
    };

    var pHome = function() {
        expect(browser().location().url()).toBe("/");
        expect(element('div[data-icon="new"]').count()).toBe(2);
        expect(element('a[data-icon="nearby"]:visible').count()).toBe(2);
        expect(element('input[data-ng-model="userInput"]:visible').count()).toBe(2);
        expect(element('div[data-icon="new"]:visible').count()).toBe(2);
        expect(element('span[data-icon="google"]').count()).toBe(1);
        expect(element('span[data-icon="linkedin"]').count()).toBe(1);
        expect(element('span[data-icon="twitter"]').count()).toBe(1);
        expect(element('span[data-icon="facebook"]').count()).toBe(1);
        expect(element('span[data-icon="email"]').count()).toBe(1);
    };

// I
// J
// K
// L
// Login
    var nav_Login = function() {
        browser().navigateTo('/login');
    };

    var pLogin = function() {
        expect(browser().location().url()).toBe("/login");
        expect(element('a:contains(Create A Wrap)').count()).toBe(1);
        expect(element('input[value="Facebook"]').count()).toBe(1);
        expect(element('input[value="Twitter"]').count()).toBe(1);
        expect(element('input[value="Google"]').count()).toBe(1);
        expect(element('input[value="LinkedIn"]').count()).toBe(1);
        expect(element('userInputAccount.login').count()).toBe(1);
        expect(element('userInputAccount.password').count()).toBe(1);
        expect(element('input[value="Login using BizBuilt account"]').count()).toBe(1);
        expect(element('a:contains(Forgot password)').count()).toBe(1);

    };


// Log out and Home
    var nav_Logout = function() {
        browser().navigateTo('/logout');
    };

// M
// Messages or Messaging
    var nav_Messages = function() {
        browser().navigateTo('/messages');
    };


    var pMessages = function() {
        expect(browser().location().url()).toBe("/messages");
    };

    var pMyWraps = function(name) {
        expect(browser().location().url()).toBe('/');
        expect(element('h1:contains(' + name + ')'));
        expect(using('.breadcrumb').element('a:contains(My wraps):visible').count()).toBe(1);
        expect(using('.content').element('button:contains(Icon)').count()).toBe(1);
        expect(using('.content').element('button:contains(List)').count()).toBe(1);
        expect(using('.content').element('button:contains(Name)').count()).toBe(1);
        expect(using('.content').element('button:contains(Privacy)').count()).toBe(1);
        expect(using('.content').element('button:contains(Requests)').count()).toBe(1);
        expect(using('.actions').element('.action.connections:visible').count()).toBe(1);
        expect(using('.actions').element('.action.bookmarks:visible').count()).toBe(1);
        expect(using('.actions').element('.action.requests:visible').count()).toBe(1);
        expect(using('.actions').element('.action.switch:visible').count()).toBe(1);
        expect(using('.actions').element('.action.share:visible').count()).toBe(1);
    };

    var pMyCurrentWrap = function(card, n) {
        expect(browser().location().url()).toBe('/' + n);
        expect(element('h1:contains(' + name + ')'));
        expect(element('.poster').count()).toBe(3);
        expect(element('.avatar').count()).toBe(3);
        expect(element('div[data-icon="share"]').count()).toBe(2);
    };



// N
// Nearby
    var nav_NearBy = function() {
        browser().navigateTo('/wraps/nearby');
    };

    var pNearBy = function() {
        expect(browser().location().url()).toBe("/wraps/nearby");
    };

// New Card
    var nav_New = function () {
        browser().navigateTo('/new');
    };

    var pNewWrap = function() {
        expect(browser().location().path()).toBe("/new");
    };


// O
// P
// Private Browsing
    var nav_PrivateBrowsing = function() {
        browser().navigateTo('/private_browsing');
    };

    var pPrivateBrowsing = function() {
        expect(browser().location().path()).toBe("/private_browsing");
    };


// Q
// R
// Requsts
    var nav_Requests = function() {
        browser().navigateTo('/wraps/requests');
    };

    var pRequests = function() {
        expect(browser().location().url()).toBe("/wraps/requests");
    };


// S
// Setings
    var nav_Settings = function(n) {
        browser().navigateTo('/account/' + n + '/settings');
    };

    var pSettings = function(n) {
        expect(browser().location().url()).toBe('/account/' + n + '/settings');
    };


// T
// Third Party Pages
    var tpFacebook = function() {
        expect(element('title' == 'Facebook'));
    };

    var tpGoogle = function() {
        expect(element('title' == 'Google Accounts'));
        expect(element('Email'));
        expect(element('Passwd'));
    };

    var tpLinkedIn = function() {
        expect(element('title' == 'Authorize | LinkedIn'));
    };

    var tpTwitter = function() {
        expect(element('title' == 'Twitter / Authorize an application'));
        expect(element('h2' == 'Authorize Development Bizbuilt to use your account?'));
        expect(using('.actions').element('.action.connections:visible').count()).toBe(1);
        expect(using('.actions').element('.action.bookmarks:visible').count()).toBe(1);
        expect(using('.actions').element('.action.share:visible').count()).toBe(1);
    };

// U
// V
// W
// My Wraps
    var nav_Wrap = function(nam) {
        browser().navigateTo('/' + nam);
    };

    var nav_Wrap_Edit = function(nam) {
        browser().navigateTo('/' + nam + '/edit');
    };

    var pForWrap = function(name, n) {
        expect(browser().location().url()).toBe('/' + n);
        expect(element('h1:contains(' + name + ')'));
    };


// X
// Y
// Z