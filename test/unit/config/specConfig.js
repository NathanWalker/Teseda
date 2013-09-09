'use strict';

describe('config.js -', function(){

  describe('config test:', function(){

    it('check variables', function(){
      expect(CONFIG.version).to.equal('0.0.1');
      expect(CONFIG.routing).to.exist;
      expect(CONFIG.viewDirectory).to.equal('views/');
      expect(CONFIG.viewFileSuffix).to.equal('.html');
      expect(CONFIG.prepareViewUrl).to.exist;
    });

  });
});
