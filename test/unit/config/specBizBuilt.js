'use strict';

describe('bizbuilt.js -', function(){

  it('check variables', function(){
    expect(BizBuilt.name).to.equal('InfoWrap');
    expect(BizBuilt.prop.docReadyTime).to.exist;
    expect(BizBuilt.prop.clientOnline).to.exist;

    expect(BizBuilt.prop.userHasBeenPromptedToShareLocation).to.equal(false);
    expect(BizBuilt.prop.userHasBeenPromptedToSeeNearby).to.equal(false);

    expect(BizBuilt.prop.isFullscreen).to.equal(false);
    expect(BizBuilt.prop.debug).to.exist;
    expect(BizBuilt.prop.maxThumbnailPreviewSize).to.equal(5 * 1024 * 1024);
    expect(BizBuilt.prop.version).to.exist;
    expect(BizBuilt.prop.webWorkersAvailable).to.exist;
    expect(BizBuilt.prop.supportedTypes).to.eql({
      images:['image/jpeg', 'image/png', 'image/gif' ]
    });
    expect(BizBuilt.prop.targetMediaQueries).to.eql({
      widths:[
        { min:1024 },
        { max:1023 }
      ]
    });

    expect(Object.keys(BizBuilt.perPageLimit)).to.eql(['project', 'gallery', 'message', 'wraps']);
    expect(Object.keys(BizBuilt.assetTypes)).to.eql(['project', 'cover', 'avatar', 'file', 'gallery']);

    expect(Object.keys(BizBuilt.localStorage.keyNames)).to.eql([
      'currentUser'
    ]);

    expect(Object.keys(BizBuilt.platform)).to.eql([
      'IS_MOBILE',
      'IS_ANDROID',
      'IS_IOS',
      'IS_IPHONE',
      'IS_IPAD',
      'IS_OTHER',
      'IS_LEGACY_IE',
      'IS_LEGACY_ANDROID',
      'IS_LEGACY_IOS',
      'version',
      'name'
    ]);

    expect(BizBuilt.regex).to.exist;


    expect(BizBuilt.uri.host).to.exist;
    expect(BizBuilt.uri.apiRoot).to.equal('/v1/');
    expect(BizBuilt.uri.frontendPort).to.equal(8000);
    expect(BizBuilt.uri.backendPort).to.equal(3000);
    expect(BizBuilt.uri.testingPorts).to.eql([9201, 9202, 9203, 8100]);
    expect(BizBuilt.uri.server).to.exist;
    expect(BizBuilt.uri.apiServerHost).to.exist;
    expect(BizBuilt.uri.apiServer).to.exist;

    expect(BizBuilt.thirdParties).to.eql({
      google_oauth2: {
        label: "Google",
        name: "google",
        url: "/auth/google_oauth2/start",
        order: 1
      },
      linkedin: {
        label: "LinkedIn",
        name: "linkedin",
        url: "/auth/linkedin/start",
        order: 2
      },
      twitter: {
        label: "Twitter",
        name: "twitter",
        url: "/auth/twitter/start",
        order: 3
      },
      facebook: {
        label: "Facebook",
        name: "facebook",
        url: "/auth/facebook/start",
        order: 4
      }
    });

    expect(BizBuilt.dateFormats).to.exist;
    expect(BizBuilt.dateFormats.full).to.equal('EEEE, MMM d, y @ h:mm a');
    expect(BizBuilt.dateFormats.short).to.equal('MM/dd/yy h:mm a');
    expect(BizBuilt.dateFormats.ago).to.equal('YYYYMMDDThhmmssZ');

    expect(BizBuilt.contacts).to.exist;
    expect(BizBuilt.contacts.defaultTypes).to.exist;
    expect(BizBuilt.contacts.defaultTypes()).to.eql(["Home", "Work", "Other"]);
    expect(BizBuilt.contacts.defaultTypes("Personal")).to.eql(["Personal", "Work", "Other"]);
    expect(BizBuilt.contacts.email.defaultType).to.equal("Work");
    expect(BizBuilt.contacts.phone.types).to.eql(["Mobile", "Main", "Office", "Toll-Free", "Home", "Fax", "Other"]);
    expect(BizBuilt.contacts.phone.defaultType).to.equal("Mobile");
    expect(BizBuilt.contacts.address.defaultType).to.equal("Work");
    expect(BizBuilt.contacts.website.defaultType).to.equal("Work");

    expect(BizBuilt.util.randomCharacters).to.exist;
    var randomChar = BizBuilt.util.randomCharacters(10);
    expect(randomChar.length).to.equal(10);
    expect(BizBuilt.util.earthDistance).to.exist;
    // requires math masters degree
    // var earthD = BizBuilt.util.earthDistance(45.4185452, -122.71580820000001, 40.4185452, -120.71580820000001);
    // expect(earthD).to.equal(0);
    expect(BizBuilt.util.safeApply).to.exist;
    expect(BizBuilt.util.imageUrlCleaner).to.exist;
    expect(BizBuilt.util.allowZoom).to.exist;
    expect(BizBuilt.util.routeCleaner).to.exist;
    expect(BizBuilt.util.pageClassFromRoute).to.exist;
    expect(BizBuilt.util.detectScreenSize).to.exist;
    expect(BizBuilt.util.disableTouchMove).to.exist;
    expect(BizBuilt.util.isImageType).to.exist;
    expect(BizBuilt.util.parseVersion).to.exist;
    expect(BizBuilt.util.stripHTML).to.exist;
    expect(BizBuilt.util.toggleSpinner).to.exist;
    expect(BizBuilt.util.hideBarScrollTo).to.exist;
    expect(BizBuilt.util.commentFromProject).to.exist;

    // defaults
    expect(BizBuilt.defaults.sortOrder).to.equal('asc');

    // lo-dash mixins
    expect(_.capitalize('test')).to.equal('Test');
    expect(_.pluralize('test')).to.equal('tests');
    expect(_.isNothing(undefined)).to.equal(true);
    expect(_.isNothing(null)).to.equal(true);
    expect(_.isNothing(NaN)).to.equal(true);
    expect(_.isNothing(0)).to.equal(true);
    expect(_.isNothing('')).to.equal(false);
    var testMoveArray = [1, 2, 3, 4];
    _.move(testMoveArray, 0, 3);
    expect(testMoveArray).to.eql([2, 3, 4, 1]);


  });

  it('check global functions', function(){

    /* check for defined functions */

    /* native object extensions */
    expect(Object.keys).to.exist;

    expect('  yo i got some whitespace'.trimLeft()).to.equal('yo i got some whitespace');
    expect('yo i got some whitespace     '.trimLeft()).to.equal('yo i got some whitespace     '); // should not trim to the right
    expect('  yo i got some whitespace'.trimRight()).to.equal('  yo i got some whitespace'); // should not trim to the left
    expect('yo i got some whitespace     '.trimRight()).to.equal('yo i got some whitespace');
    expect('     yo i got some whitespace     '.trim()).to.equal('yo i got some whitespace');

    expect(_.capitalize('i got really bad grammar until I capitalize my sentences.')).to.equal('I got really bad grammar until I capitalize my sentences.');

  });


});
