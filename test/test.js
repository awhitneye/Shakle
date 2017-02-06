var fs = require('fs');
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

    it('should have a "showCallStack" property initially set to false', function() {
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

    it('should be pseudoclassical', function () {
      expect(shakle instanceof Shakle).to.be.true;
    });

    xit('should have a state property', function () {
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
      return new Shakle(function (resolve, reject) {
        fs.readFile(input, 'utf-8', function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
      });
    };

    var shakledFn2 = function (input) {
      return new Shakle(function (resolve, reject) {
        setTimeout(function () {                               // THE CHECKING OF THE VARIBLES/ METHODS IN THE PROMISE WILL HAVE TO BE DONE NOT HERE
          var result = JSON.parse(input);                      // WILL HAVE TO DO IT SIMILARLY TO BELOW, CHECKING ONE THING AT A TIME BY WRAPPING THE DUPLICATED CHAIN IN INDIVIDUAL IT STATEMENTS DEPENDING ON WHATS BEING TESTED
          result = +result.one + +result.two + +result.three;  // PROBABLY BY JUST CALLING IT IN IAN IT STATEMENT AND PROBING THE PROMISE THAT GETS RETURNED 
          resolve(result);
        }, 200);
      });
    };

    // THIS WILL HAVE TO BE DONE IN CHUNKS, AN "IT" STATEMENT WRAPPING EACK GROWING CHAIN SO YOU CAN USE THE DONE() TRICK EACH TIME YOU ADD SOMETHING TO THE TEST
  
    xit('(of first) shakled function should return a promise object', function () {
      expect(shakledFn1('test.txt') instanceof Shakle).to.be.true;
    });

    xit('(of second) shakled function should return a promise object', function () {
      expect(shakledFn2('{"one": 1, "two": 2, "three": 3}') instanceof Shakle).to.be.true;
    });

    // it('should change state to "resolved" on resolution', function (done) {
    //   shakledFn1('test.txt')
    //   .then(function () {
    //     done();
    //   });
    // });

    xit('should resolve the correct data from promisified fileRead function', function (done) {
      shakledFn1('test.txt')
        .then(function (data) {
          expect(data).to.equal('{"one": 1, "two": 2, "three": 3}');
          done();
        });
    });

    xit('should resolve the correct data from promisified timeout function', function (done) {
      shakledFn2('{"one": 1, "two": 2, "three": 3}')
        .then(function (data) {
          expect(data).to.equal(6);
          done();
        });
    });

    xit('should be able to chain multiple promisified functions', function (done) {
      shakledFn1('test.txt')
        .then(shakledFn2)
        .then(function (data) {
          expect(data).to.equal(6);
          done();
        });
    });

  });

  describe('rejection', function () {

    var shakledFn1 = function (input, done) {
      return new Shakle(function (resolve, reject) {
        fs.readFile(input, 'utf-8', function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
          if (done) {done();}
        });
      });
    };

    var shakledFn2 = function (input, done) {
      return new Shakle(function (resolve, reject) {
        setTimeout(function () {                               
          var result = JSON.parse(input);                      
          result = +result.one + +result.two + +result.three;  
          resolve(result);
          if (done) {done();}
        }, 200);
      });
    };


    xit('should reject error data from promisified fileRead function', function (done) {
      shakledFn1('tes.txt')
        .then(function () {})
        .catch(function (error) {
          expect(error).to.contain('Error:');
        });
    });

    xit('should reject error data from promisified timeout function', function (done) {
      shakledFn2('zoinks')
        .then(function () {})
        .catch(function (error) {
          expect(error).to.contain('Error:');
        });
    });

    xit('should pass errors down the chain', function (done) {
      shakledFn1('tes.txt')
        .then(shakledFn2)
        .catch(function (error) {
          expect(error).to.contain('Error:');
        });
    });

    // Shakle.showCallStack = true; // is this hoisted or something? it makes a test at the top fail...

    // var shakledFn1 = function (input, done) {
    //   return new Shakle(function (resolve, reject) {
    //     fs.readFile(input, 'utf-8', function (err, data) {
    //       if (err) {
    //         reject(err);
    //       } else {
    //         resolve(data);
    //       }
    //       if (done) {done();}
    //     });
    //   });
    // };

    // var shakledFn2 = function (input, done) {
    //   return new Shakle(function (resolve, reject) {
    //     setTimeout(function () {                               
    //       var result = JSON.parse(input);                      
    //       result = +result.one + +result.two + +result.three;  
    //       resolve(result);
    //       if (done) {done();}
    //     }, 200);
    //   });
    // };

    xit('should show the full error call stack when "showCallStack" flag is set to true', function (done) {
      shakledFn1('tes.txt')
        .then(shakledFn2)
        .catch(function (error) {
          expect(error).to.contain('Error:');
        });
    });

  });

  describe('method:', function () {

    describe('promisify', function () {

      it('should use an instance of its own class', function() {
        expect(Shakle.promisify()).to.have.property('state');
      });

    });

    describe('resolveAll', function () {

      xit('should resolve an array', function () {
        expect(false).to.be.true;
      });

    });

    describe('chainAll', function () {

      xit('chain all the passed in functions', function () {
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