   // Elements on page
// Test Steps for page



// Buttons
    var click_bNewWrap = function() {
        element('div[data-icon="new"]').click();
    };
    var click_bCancel = function() {
        element('.btn','Cancel').click();
    };

    var click_bSave = function() {
        element('input[value="Save"]').click();
    };

    var click_bBookmark = function() {
        element('div[data-icon="bookmark"]').click();
        sleep(2);
    };

    var verify_bBookmark_active = function() {
        expect(using('.action.bookmark').element('div[data-state="active"]').count()).toBe(1);
    };

    var verify_bBookmark_inactive = function() {
        expect(using('.action.bookmark').element('div[data-state="active"]').count()).toBe(0);
    };

    var click_bConnect = function() {
        element('.action.connect').click();
    };

    var click_bFacebook = function() {
        element('a:contains(Facebook)').click();
    };

    var click_bGoogle = function() {
        element('a:contains(Google)').click();
    };

    var click_bLinkedIn = function() {
        element('a:contains(LinkedIn)').click();
    };

    var click_bTwitter = function() {
        element('a:contains(Twitter)').click();
    };

    var click_bUpdate = function() {
        element('input[value="Update"]').click();
    };

    var click_bUploadFiles = function() {
        element('a:contains(Upload Files)').click();
    };


// Caption
// Checkbox
// Drop Down List
// Elements
    var verify_CommonElements = function() {
        expect(element('.toggle.leftbar'));
        expect(element('.sidebar.leftbar')); 

    };

// Fields
    var type_in_fGlobalSearch = function(search) {
        input('userInput').enter(search);
        sleep(2);
    };

    var type_in_fLocalSearch = function(local) {
        input('model').enter(local);
        sleep(1);
    };

    var ve_fSearch = function() {
        expect(element('userInputSearchWraps.name'));
    };

// Image
// Logo
// Links
    var lLoginHere = function(){
        element('a:contains(Login Here)').click();
    };


// Menu
    var click_menu = function() {
        element('.toggle.leftbar').click();
    };

    var click_mBookmarks = function(){
        element('a:contains(Bookmarks)').click();
    };

    var click_mConnectRequest_from = function(name) {
        element('a:contains(Connect: ' + name + ')');
    };

    var verify_mConnectRequest_from = function(name) {
        expect(element('a:contains(Connect: ' + name + ')'));
    };

    var click_mConnections = function(){
        element('a:contains(Connections)').click();
    };

    var click_mLogout = function(){
        element('a:contains(Logout)').click();
    };

    var click_mMyCurrentWrap = function(){
        element('a:contains(My Current Wrap)').click();
    };

    var click_mMyWrap = function(){
        element('a:contains(My Wraps)').click();
    };

    var click_mNearby = function() {
        element('a:contains(New)').click();
    };

    var click_mNewGallery = function() {
        element('a:contains(New Gallery)').click();
    };

    var click_mNewWrap = function() {
        element('a:contains(New Wrap)').click();
    };

    var click_mNewGallery = function() {
        element('a:contains(Add a Gallery)').click();
    };

    var click_mNewContactInfo = function() {
        element('a:contains(New Contact Info)').click();
    };

    var click_mNewWriteUp = function() {
        element('a:contains(New Write-Up)').click();
    };

    var click_mNewMessage = function() {
        element('a:contains(New Message)').click();
    };

    var click_mRequests = function(){
        element('a:contains(Requests)').click();
    };

    var click_mSettings = function() {
        element('a:contains(Settings)').click();
    };

    var mWrap = function() {
        element('span[data-bb-project-title="currentProject.name"]').click();
    }



// Radiobutton
// Section
// Sub Menu
// Tabs
// Text

// Functions (Test cases with more than one element)
