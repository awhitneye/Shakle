// include chai
var chai = require('chai');
// define assesion library as variable
var expect = chai.expect;
// include the file to unit test
var Shakle = require('../lib/shakle.js');


describe('Shakle', function () {

  describe('export', function () {
 
    it('should exist', function () {
      expect(Shakle).to.exist;
    });

    it('should have a promisify method', function () {
      expect(Shakle.promisify).to.exist;
    });

    it('should have a "showCallStack" property', function() {
      expect(Shakle.showCallStack).to.exist;
    });

  });

  describe ('instantiation', function () {

    it('should have a test property', function () {
      expect(new Shakle().test).to.equal('whatever');
    });

  })

  describe('method:', function () {

    describe('promisify', function () {

      it('should use an instantiate of its own class', function() {
        expect(Shakle.promisify().test).to.equal('whatever');
      });

    })

  });

});

// range class
// lrucache
// asyncmap

// SPECS: 
//