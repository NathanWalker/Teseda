'use strict';

describe('teseda.js -', function(){

  it('check variables', function(){
    expect(Teseda.name).to.equal('Teseda');
    expect(Teseda.prop.docReadyTime).to.exist;
    expect(Teseda.prop.clientOnline).to.exist;

    expect(Teseda.prop.userHasBeenPromptedToShareLocation).to.equal(false);
    expect(Teseda.prop.userHasBeenPromptedToSeeNearby).to.equal(false);

    expect(Teseda.prop.isFullscreen).to.equal(false);
    expect(Teseda.prop.debug).to.exist;
    expect(Teseda.prop.maxThumbnailPreviewSize).to.equal(5 * 1024 * 1024);
    expect(Teseda.prop.version).to.exist;
    expect(Teseda.prop.webWorkersAvailable).to.exist;
    expect(Teseda.prop.supportedTypes).to.eql({
      images:['image/jpeg', 'image/png', 'image/gif' ]
    });
    expect(Teseda.prop.targetMediaQueries).to.eql({
      widths:[
        { min:1024 },
        { max:1023 }
      ]
    });

    expect(Object.keys(Teseda.perPageLimit)).to.eql(['project', 'gallery', 'message', 'wraps']);
    expect(Object.keys(Teseda.assetTypes)).to.eql(['project', 'cover', 'avatar', 'file', 'gallery']);

    expect(Object.keys(Teseda.localStorage.keyNames)).to.eql([
      'currentUser'
    ]);

    expect(Object.keys(Teseda.platform)).to.eql([
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

    expect(Teseda.regex).to.exist;


    expect(Teseda.uri.host).to.exist;
    expect(Teseda.uri.apiRoot).to.equal('/v1/');
    expect(Teseda.uri.frontendPort).to.equal(8000);
    expect(Teseda.uri.backendPort).to.equal(3000);
    expect(Teseda.uri.testingPorts).to.eql([9201, 9202, 9203, 8100]);
    expect(Teseda.uri.server).to.exist;
    expect(Teseda.uri.apiServerHost).to.exist;
    expect(Teseda.uri.apiServer).to.exist;

    expect(Teseda.thirdParties).to.eql({
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

    expect(Teseda.dateFormats).to.exist;
    expect(Teseda.dateFormats.full).to.equal('EEEE, MMM d, y @ h:mm a');
    expect(Teseda.dateFormats.short).to.equal('MM/dd/yy h:mm a');
    expect(Teseda.dateFormats.ago).to.equal('YYYYMMDDThhmmssZ');

    expect(Teseda.util.randomCharacters).to.exist;
    var randomChar = Teseda.util.randomCharacters(10);
    expect(randomChar.length).to.equal(10);
    expect(Teseda.util.earthDistance).to.exist;
    // requires math masters degree
    // var earthD = Teseda.util.earthDistance(45.4185452, -122.71580820000001, 40.4185452, -120.71580820000001);
    // expect(earthD).to.equal(0);
    expect(Teseda.util.safeApply).to.exist;
    expect(Teseda.util.imageUrlCleaner).to.exist;
    expect(Teseda.util.allowZoom).to.exist;
    expect(Teseda.util.routeCleaner).to.exist;
    expect(Teseda.util.pageClassFromRoute).to.exist;
    expect(Teseda.util.detectScreenSize).to.exist;
    expect(Teseda.util.disableTouchMove).to.exist;
    expect(Teseda.util.isImageType).to.exist;
    expect(Teseda.util.parseVersion).to.exist;
    expect(Teseda.util.stripHTML).to.exist;
    expect(Teseda.util.toggleSpinner).to.exist;
    expect(Teseda.util.hideBarScrollTo).to.exist;
    expect(Teseda.util.commentFromProject).to.exist;

    // defaults
    expect(Teseda.defaults.sortOrder).to.equal('asc');

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
