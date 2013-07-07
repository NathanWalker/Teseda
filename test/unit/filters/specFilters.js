//
// test/unit/filters/filtersSpec.js
//
describe("Unit: Testing Filters", function() {

  var filter;
  var testSampleCard = {
    id:11,
    name:'Nathan Walker',
    avatar_url:'/img/common/card_default.png',
    identifier:'NathanWalker',
    publishable:true,
    connection_requests:[],
    flow_step:'done'
  };
  var orderedCardsArray = [
    {name:'Andy'},
    {name:'Brian'},
    {name:'John Miller'},
    {name:'Jon Dodson'},
    {name:'Jon Marcel'},
    {name:'Nathan'}
  ];

  var unorderedCardsArray = [
    {name:'Jon Dodson'},
    {name:'Brian'},
    {name:'Andy'},
    {name:'Jon Marcel'},
    {name:'John Miller'},
    {name:'Nathan'}
  ];

  var groupedCardsArray = [
    { letter:'A', group:[
      { name:'Andy' }
    ] },
    { letter:'B', group:[
      { name:'Brian' }
    ] },
    { letter:'J', group:[
      { name:'John Miller' },
      { name:'Jon Dodson' },
      { name:'Jon Marcel' }
    ] },
    { letter:'N', group:[
      { name:'Nathan' }
    ] }
  ];

  beforeEach(angular.mock.module('App'));

  beforeEach(inject(function($filter){
    filter = $filter;
  }));

    it("'groupByLetter' should create grouped array. 'unGroupByLetter' should revert them to flat array", function(){

      var groupedArray = filter('groupByLetter')(unorderedCardsArray, 'name');
      expect(filter('groupByLetter')(unorderedCardsArray, 'name')).to.eql(groupedCardsArray);
      expect(filter('unGroupByLetter')(groupedArray)).to.eql(orderedCardsArray);
    });

    it("'groupByCategory' should create grouped array by specified set of categories.", function(){
      var featuredCategories = ["products", "businesses", "professionals", "projects", "individuals"];
      var categorizedCards = [];
      for(var i=0; i < featuredCategories.length; i++){
        var cat = featuredCategories[i];
        var card = unorderedCardsArray[i];
        var clonedCard = _.clone(card);
        clonedCard.category = cat;
        categorizedCards.push(_.clone(clonedCard));
      }
      expect(categorizedCards).to.eql([
        { name : 'Jon Dodson', category : 'products' },
        { name : 'Brian', category : 'businesses' },
        { name : 'Andy', category : 'professionals' },
        { name : 'Jon Marcel', category : 'projects' },
        { name : 'John Miller', category : 'individuals' }
      ]);

      expect(filter('groupByCategory')(categorizedCards, featuredCategories)).to.eql([
        { category : 'products', group : [ { name : 'Jon Dodson', category : 'products' } ] },
        { category : 'businesses', group : [ { name : 'Brian', category : 'businesses' } ] },
        { category : 'professionals', group : [ { name : 'Andy', category : 'professionals' } ] },
        { category : 'projects', group : [ { name : 'Jon Marcel', category : 'projects' } ] },
        { category : 'individuals', group : [ { name : 'John Miller', category : 'individuals' } ] }
      ]);
    });

    it("'sortByProp' should sort an array by the given property", function(){
      expect(filter('sortByProp')(unorderedCardsArray, 'name')).to.eql(orderedCardsArray);
    });

    it("stripHTML: should strip html tags from text", function(){
      expect(filter('stripHTML')('<p>Testing news is always a good time even when my words get cut off early, like last time I mentioned the B word around my girlfriend. Good time to drop etiquette rules: <a href="http://www.affluentmagazine.com/articles/article/688">http://www.affluentmagazine.com/articles/article/688</a> ...Read it...Boom!</p>')).to.eql('Testing news is always a good time even when my words get cut off early, like last time I mentioned the B word around my girlfriend. Good time to drop etiquette rules: http://www.affluentmagazine.com/articles/article/688 ...Read it...Boom!');
    });

    it("totalWithText: should take the input total with a string argument of text to display and pluralize it properly", function(){
      expect(filter('totalWithText')(2, 'Comment')).to.equal('2 Comments');
      expect(filter('totalWithText')(1, 'Comment')).to.equal('1 Comment');
      expect(filter('totalWithText')(0, 'Comment')).to.equal('Comment');
      expect(filter('totalWithText')(10, 'Connection')).to.equal('10 Connections');
      expect(filter('totalWithText')(0, 'Connection', true)).to.equal('');
      expect(filter('totalWithText')(1, 'Connection', true)).to.equal('1 Connection');
      expect(filter('totalWithText')(0, '')).to.equal(0);
      expect(filter('totalWithText')(1, '')).to.equal(1);
      expect(filter('totalWithText')(12, '')).to.equal(12);
    });

    it("fileSize: should take the bytes as number or string and format using standard file size conventions", function(){
      expect(filter('fileSize')(2453634573457)).to.equal('2285.13 GB');
      expect(filter('fileSize')('0987345623465203475')).to.equal('919537268.08 GB');
      expect(filter('fileSize')('5000')).to.equal('5 KB');
      expect(filter('fileSize')(131072)).to.equal('128 KB');
      expect(filter('fileSize')()).to.equal('0 Bytes');
      expect(filter('fileSize')(null)).to.equal('0 Bytes');
      expect(filter('fileSize')('null')).to.equal('0 Bytes');
    });

    it("fileNameFromUrl: should take url and return just the filename from it", function(){
      expect(filter('fileNameFromUrl')('http://www.bizbuilt.com/11/files/vault/test.jpg')).to.equal('test.jpg');
      expect(filter('fileNameFromUrl')('http://www.bizbuilt.com/11/files/vault/test.jpg#somestuff')).to.equal('test.jpg');
      expect(filter('fileNameFromUrl')('http://www.bizbuilt.com/11/files/vault/test.jpg?this=that')).to.equal('test.jpg');
    });

    it("booleanText: should take a boolean and return the true or false text provided", function(){
      expect(filter('booleanText')(true, 'Unpublish', 'Publish')).to.equal('Unpublish');
      expect(filter('booleanText')(false, 'Unpublish', 'Publish')).to.equal('Publish');
    });

    it("truncate: should take text and truncate accordingly", function(){
      expect(filter('truncate')('Yo, check it out.', 100)).to.equal('Yo, check it out.');
      expect(filter('truncate')('I mean does it really need to be this long?', 10)).to.equal('I mean ...');
      expect(filter('truncate')('I mean does it really need to be this long?', 20)).to.equal('I mean does it re...');
      expect(filter('truncate')('I mean does it really need to be this long?', 20, ' ->')).to.equal('I mean does it re ->');
    });

    it("momentAgo: should return datetime formatted as momentago", function(){
      var jsonDate = JSON.parse(JSON.stringify(new Date()));
      expect(filter('momentAgo')(jsonDate)).to.equal('a few seconds ago');
    });

  it("teL: should format a telephone number if no formatting is already provided", function(){
    expect(filter('tel')('5035554343')).to.equal('(503) 555-4343');
    expect(filter('tel')('503-555-4343')).to.equal('503-555-4343');
    expect(filter('tel')('(503) 555-4343')).to.equal('(503) 555-4343');
    expect(filter('tel')('(503) 555-434334532453ext')).to.equal('(503) 555-434334532453ext');
  });

  it("fileExtFromMime: should strip extension from file object [type or mime_type] and can input a string", function(){
    var file = {
      type:'image/png'
    };
    expect(filter('fileExtFromMime')(file)).to.equal('png');
    expect(filter('fileExtFromMime')('image/png')).to.equal('png');
    expect(filter('fileExtFromMime')('image/gif')).to.equal('gif');
    expect(filter('fileExtFromMime')('application/pdf')).to.equal('pdf');
    file = {
      mime_type:'image/png'
    };
    expect(filter('fileExtFromMime')(file)).to.equal('png');
    file = {
      blah:'image/png'
    };
    expect(filter('fileExtFromMime')(file)).to.equal('');
    file = {
      mime_type:'image/png',
      type:'file_asset'
    }; // handle custom case for filepicker integration
    expect(filter('fileExtFromMime')(file)).to.equal('png');
    file = {
      mimetype:'image/png',
      type:'file_asset'
    }; // mimetype may not have an underscore between (filepicker.io's api)
    expect(filter('fileExtFromMime')(file)).to.equal('png');
  });

  it("excludeAssetGroupType: should exclude an asset group collection by type", function(){
    var wrap = {
      asset_groups:[
        {id:1, type:'file'},
        {id:2, type:'gallery'},
        {id:3, type:'contact'},
        {id:4, type:'contact'}
      ]
    };
    expect(filter('excludeAssetGroupType')(wrap.asset_groups, 'contact')).to.eql([
      {id:1, type:'file'},
      {id:2, type:'gallery'}
    ]);
    expect(filter('excludeAssetGroupType')(wrap.asset_groups, 'file')).to.eql([
      {id:2, type:'gallery'},
      {id:3, type:'contact'},
      {id:4, type:'contact'}
    ]);
    expect(filter('excludeAssetGroupType')(wrap.asset_groups, 'gallery')).to.eql([
      {id:1, type:'file'},
      {id:3, type:'contact'},
      {id:4, type:'contact'}
    ]);
    expect(filter('excludeAssetGroupType')(wrap.asset_groups, 'gallery')).not.to.eql([
      {id:1, type:'file'},
      {id:2, type:'gallery'},
      {id:3, type:'contact'},
      {id:4, type:'contact'}
    ]);
    // should work with objects as well - for ng-repeat
    expect(filter('excludeAssetGroupType')({id:2, type:'gallery'}, 'gallery')).to.eql(false); // returns false if exclusion type is found
    expect(filter('excludeAssetGroupType')({id:2, type:'gallery'}, 'file')).to.eql(true); // returns true if exclusion type is not found
    // should work with comma delimited values
    expect(filter('excludeAssetGroupType')(wrap.asset_groups, 'gallery,file')).to.eql([
      {id:3, type:'contact'},
      {id:4, type:'contact'}
    ]);

  });

  it("assetGroupType: should filter an asset group collection by specified type", function(){
    var wrap = {
      asset_groups:[
        {id:1, type:'file'},
        {id:2, type:'gallery'},
        {id:3, type:'contact'},
        {id:4, type:'contact'}
      ]
    };
    expect(filter('assetGroupType')(wrap.asset_groups, 'contact')).to.eql([
      {id:3, type:'contact'},
      {id:4, type:'contact'}
    ]);
    expect(filter('assetGroupType')(wrap.asset_groups, 'file')).to.eql([
      {id:1, type:'file'}
    ]);
    expect(filter('assetGroupType')(wrap.asset_groups, 'gallery')).to.eql([
      {id:2, type:'gallery'}
    ]);
    expect(filter('assetGroupType')(wrap.asset_groups, 'gallery')).not.to.eql([
      {id:1, type:'file'}
    ]);
    // should work with objects as well - for ng-repeat
    expect(filter('assetGroupType')({id:2, type:'gallery'}, 'gallery')).to.eql(true); // returns true if type is found
    expect(filter('assetGroupType')({id:2, type:'gallery'}, 'file')).to.eql(false); // returns false if type is not found

  });

  it("shorten: should shorten text mac os x style (middle shortening)", function(){
    expect(filter('shorten')('This is a really long string that should be shortened in a nice way.', 20)).to.equal('This is a &hellip; nice way.');
    expect(filter('shorten')('This is a really long string that should be shortened in a nice way.', 10)).to.equal('This &hellip; way.');
    // using mode
    expect(filter('shorten')('This is a really long string that should be shortened in a nice way.', 20, {mode:'truncate'})).to.equal('This is a really lon&hellip;');
    // should handle null and undefined
    expect(filter('shorten')(null, 20)).to.equal('');
    expect(filter('shorten')(undefined, 20)).to.equal('');
    // should handle numbers
    expect(filter('shorten')(603245, 20)).to.equal('603245');
  });

});
