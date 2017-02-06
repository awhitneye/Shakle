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

    xit('should have a "showCallStack" property', function() {
      expect(Shakle).to.have.property('showCallStack');
    });

    xit('should have a "showCallStack" property initially set to false', function() {
      expect(Shakle.showCallStack).to.be.false;
    });

    it('should have a "promisify" method', function () {
      expect(Shakle).to.have.property('promisify');
    });

    it('should have a "promisifyAll" method', function () {
      expect(Shakle).to.have.property('promisifyAll');
    });

    it('should have a "resolveAll" method', function () {
      expect(Shakle).to.have.property('resolveAll');
    });

  });

  describe ('instantiation', function () {
    var shakle = new Shakle();

    xit('should be pseudoclassical', function () {
      expect(shakle instanceof Shakle).to.be.true;
    });

    xit('should have a "then" property', function () {
      expect(shakle).to.have.property('then');
    });

    xit('should have a "catch" property', function () {
      expect(shakle).to.have.property('catch');
    });

  });

  describe('resolution', function () {

    var doubler = function(value) {
      return value * 2;
    };

    var shakledFn1 = function (input) {
      return new Shakle(function (resolve) {
        fs.readFile(input, 'utf-8', function (err, data) {
          if (!err) {
            resolve(data);
          }
        });
      });
    };

    var shakledFn2 = function (input) {
      return new Shakle(function (resolve) {
        setTimeout(function () {                               
          var result = JSON.parse(input);                      
          result = +result.one + +result.two + +result.three;  
          resolve(result);
        }, 200);
      });
    };

  
    xit('(of first) shakled function should return a promise object', function () {
      expect(shakledFn1('test.txt') instanceof Shakle).to.be.true;
    });

    xit('(of second) shakled function should return a promise object', function () {
      expect(shakledFn2('{"one": 1, "two": 2, "three": 3}') instanceof Shakle).to.be.true;
    });

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

    xit('should chain non-promisified functions passed into .then()', function (done) {
      shakledFn2('{"one": 1, "two": 2, "three": 3}')
        .then(doubler)
        .then(doubler)
        .then(function (value) {
          expect(value).to.equal(24);
        });
    });

    xit('should be able to handle a promise as a return value in the chain', function (done) {
      shakledFn1('test.txt')
        .then(shakledFn2)
        .then(function (data) {
          expect(data).to.equal(6);
          done();
        });
    });

    xit('should be able to chain multiple promisified functions', function (done) {

      shakledFn1('test.txt')
      .then(shakledFn2)
      .then(doubler)
      .then(function (data) {
        expect(data).to.equal(12);
        done();
      });
    });

  });

  describe('rejection', function () {

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
        setTimeout(function () {                               
          var result = JSON.parse(input);                      
          result = +result.one + +result.two + +result.three;  
          resolve(result);
        }, 200);
      });
    };


    xit('should reject error data from promisified fileRead function', function (done) {
      shakledFn1('tes.txt')
        .then(function () {})
        .catch(function (error) {
          expect(error).to.contain('Error:');
          done();
        });
    });

    xit('should reject error data from promisified timeout function', function (done) {
      shakledFn2('zoinks')
        .then(function () {})
        .catch(function (error) {
          expect(error).to.contain('Error:');
          done();
        });
    });

    xit('should reject error data from non-promisified function', function (done) {
      shakledFn1('test.txt')
        .then(function (data) {
          return data.test;
        })
        .catch(function (error) {
          expect(error).to.contain('Error:');
          done();
        });
    });

    xit('should pass errors down the chain', function (done) {
      shakledFn1('tes.txt')
        .then(shakledFn2)
        .catch(function (error) {
          expect(error).to.contain('Error:');
          done();
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

      xit('should use an instance of its own class', function() {
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