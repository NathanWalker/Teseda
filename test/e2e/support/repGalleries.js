// Elements on page
// Test Steps for page

// Buttons
	var bBack_to_Wrap_Home = function() {
		element('a:contains(Back to Wrap Home)').click();
	};

	var bGallery = function() {
		element()
	}

	var pGallery_click_bAddImages = function(gallery) {
		using('.meta', gallery).element('button[value="Add Images"]').click();
	};

	var pGallery_click_bEdit = function(gallery) {
		using('.meta', gallery).element('.icon-edit.ng-isolate-scope.ng-scope').click();
	};

	var pGallery_click_bDelete = function(gallery) {
		using('.meta', gallery).element('.icon-trash.ng-isolate-scope.ng-scope').click();
	};

// Caption
// Checkbox
// Drop Down List

// Fields

// Image
// Logo
// Links
// Menu
// Radiobutton
// Section
// Sub Menu
// Tabs
// Text
	var verify_tGallery =  function(gallery) {
		expect(element('h4:contains' == gallery).count()).toBe(1);
	};

	var verify_no_tGallery =  function(gallery) {
		expect().not(element('h4' == gallery));
	};

// Title
// Verify


// Functions (Test cases with more than one element)