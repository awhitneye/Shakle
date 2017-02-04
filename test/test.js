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

    it('should have a "showCallStack" property', function() {
      expect(Shakle).to.have.property('showCallStack');
    });

    it('should have a "showCallStack" property innitially set to false', function() {
      expect(Shakle.showCallStack).to.be.false;
    });

    it('should have a "promisify" method', function () {
      expect(Shakle).to.have.property('promisify');
    });

    it('should have a "resolveAll" method', function () {
      expect(Shakle).to.have.property('resolveAll');
    });

    it('should have a "chainAll" method', function () {
      expect(Shakle).to.have.property('chainAll');
    });

  });

  describe ('instantiation', function () {
    var shakle = new Shakle();

    it('should have a state property', function () {
      expect(shakle).to.have.property('state');
    });

  });

  describe('resolution', function () {

    // it('should be called eventually', function (done) {
    //   setTimeout(function () {
    //     expect(true).to.be.true;
    //     done();
    //   }, 500);
    // });
    // // exmple of how to use done() for async testing

    var shakledFn1 = function (input) {

      // inside a timeout
      // does something with the input

      // new Shakle(function (resolve, reject) {

      //   it('should change its state to "resolved"', function () { // THE IT STATEMENT WILL HAVE TO CONTAIN THE TIMEOUT SO YOU CAN USE THE DONE() TRICK
      //     expect(false).to.be.true
      //   })
      // });

    };

    var shakledFn2 = function (input) {

      // inside a timeout
      // does something with the input

      // new Shakle(function (resolve, reject) {

      //   it('should change its state to "resolved"', function () { // THE CHECKING OF THE VARIBLES/ METHODS IN THE PROMISE WILL HAVE TO BE DONE NOT HERE
      //     expect(false).to.be.true                                // WILL HAVE TO DO IT SIMILARLY TO BELOW, CHECKING ONE THING AT A TIME BY WRAPPING THE DUPLICATED CHAIN IN INDIVIDUAL IT STATEMENTS DEPENDING ON WHATS BEING TESTED
      //   })                                                        // PROBABLY BY JUST CALLING IT IN IAN IT STATEMENT AND PROBING THE PROMISE THAT GETS RETURNED 
      // });

    };

    // THIS WILL HAVE TO BE DONE IN CHUNKS, AN "IT" STATEMENT WRAPPING EACK GROWING CHAIN SO YOU CAN USE THE DONE() TRICK EACH TIME YOU ADD SOMETHING TO THE TEST
    
    // shakledFn1(input)
    //   .then(function (data) {
        
    //     it('should pass the correct data to the first .then statement', function () {
    //       expect(false).to.be.true
    //     }) 

    //     return shakledFn2(data)
    //   })

    //   .then(function (data2) {
        
    //     it('should pass the correct data to the second .then statement', function () {
    //       expect(false).to.be.true
    //     }) 
    //   })

    //   .catch(function (error) {
    //     it('should be silent when no errors are present', function () {
    //       expect(false).to.be.true
    //     }) 
    //   })

  });

  describe('rejection', function () {
    // do the same as resolution but pass in the wrong data

    // then set the showCallStack to true and see test for call stack logging
  });

  describe('method:', function () {

    describe('promisify', function () {

      it('should use an instantiate of its own class', function() {
        expect(Shakle.promisify()).to.have.property('state');
      });

    });

    describe('all', function () {

      it('should resolve an array', function () {
        expect(false).to.be.true;
      });

    });

  });

});

// make sure the promises' variables change as expected during the lifecycle of the promise
// check that the functions behave respond correctly in isolation, then together
// NEED SOME SPIES TO SEE IF THE FUNCTIONS ARE BEHAVING CORRECTLY
// need to check at each phase of the promise lifecycle, probably need to use the done() of stubs or something


// range class
// lrucache
// asyncmap


// SPECS: 
//