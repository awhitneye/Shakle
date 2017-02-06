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

    it('should have a "promisify" method', function () {
      expect(Shakle).to.have.property('promisify');
    });

    it('should have a "raceAll" method', function () {
      expect(Shakle).to.have.property('resolveAll');
    });

    it('should have a "resolveAll" method', function () {
      expect(Shakle).to.have.property('resolveAll');
    });

  });

  describe ('instantiation', function () {
    var shakle = new Shakle();

    it('should be pseudoclassical', function () {
      expect(shakle instanceof Shakle).to.be.true;
    });

    it('should have a "then" property', function () {
      expect(shakle).to.have.property('then');
    });

    it('should have a "catch" property', function () {
      expect(shakle).to.have.property('catch');
    });

  });

  describe('resolution', function () {

    var doubler = function(value) {
      return value * 2;
    };

    var returnValue = function () {
      return new Shakle(function (resolve) {
        setTimeout(function () {
          resolve(100);
        });
      });
    };

    var shakledFn1 = function (input) {
      return new Shakle(function (resolve) {
        fs.readFile(__dirname + input, 'utf-8', function (err, data) {
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
        }, 100);
      });
    };


    it('should resolve a returned promise', function (done) {
      returnValue()
        .then(function (value) {
          expect(value).to.equal(100);
          done();
        });
    });


    it('(of first) shakled function should return a promise object', function () {
      expect(shakledFn1('/test.txt') instanceof Shakle).to.be.true;
    });


    it('(of second) shakled function should return a promise object', function () {
      expect(shakledFn2('{"one": 1, "two": 2, "three": 3}') instanceof Shakle).to.be.true;
    });


    it('should resolve the correct data from promisified fileRead function', function (done) {
      shakledFn1('/test.txt')
        .then(function (data) {
          expect(data).to.equal('{"one": 1, "two": 2, "three": 3}');
          done();
        });
    });


    it('should resolve the correct data from promisified timeout function', function (done) {
      shakledFn2('{"one": 1, "two": 2, "three": 3}')
        .then(function (data) {
          expect(data).to.equal(6);
          done();
        });
    });

    it('should chain non-promisified functions passed into .then()', function (done) {
      shakledFn2('{"one": 1, "two": 2, "three": 3}')
        .then(doubler)
        .then(doubler)
        .then(function (value) {
          expect(value).to.equal(24);
          done();
        });
    });

    it('callback to then should be optional', function (done) {
      shakledFn2('{"one": 1, "two": 2, "three": 3}')
        .then()
        .then(doubler)
        .then(function (value) {
          expect(value).to.equal(12);
          done();
        });
    });

    it('should be able to handle a promise as a return value later in the chain', function (done) {
      shakledFn1('/test.txt')
        .then(shakledFn2)
        .then(function (data) {
          expect(data).to.equal(6);
          done();
        });
    });


    it('should be able to chain multiple promisified functions', function (done) {

      shakledFn1('/test.txt')
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
        fs.readFile(__dirname + input, 'utf-8', function (err, data) {
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
        }, 100);
      });
    };


    it('should reject handled errors', function (done) {
      shakledFn1('/tes.txt')
        .then()
        .catch(function (error) {
          expect(error).to.contain('Error:');
          done();
        });
    });

    it('should pass errors down the chain', function (done) {
      shakledFn1('/tes.txt')
        .then(shakledFn2)
        .catch(function (error) {
          expect(error).to.contain('Error:');
          done();
        });
    });

  });

  describe('method:', function () {

    describe('promisify', function () {
      
      var shakledReadFile = Shakle.promisify(fs.readFile);
      
      it('should return a function that returns a promise when invoked', function() {
        expect(shakledReadFile('test.txt', 'utf-8') instanceof Shakle).to.be.true;
      });

      it('should resolve to the correct value', function(done) {
        shakledReadFile(__dirname + '/test.txt', 'utf-8')
          .then(function (value) {
            expect(value).to.equal('{"one": 1, "two": 2, "three": 3}');
            done();
          });
      });

      it('should reject to handled errors', function(done) {
        shakledReadFile(__dirname + 'test.txt', 'utf-8')
          .then()
          .catch(function (err) {
            expect(err).to.contain('Error:');
            done();
          });
      });

    });


    describe('raceAll', function () {

      var wait = function (time) {
        return new Shakle(function(resolve) {
          setTimeout(function () {
            resolve(time);
          }, time);
        });
      };

      it('resolve the first value to be resolved', function (done) {
        Shakle.raceAll([wait(300), wait(200), wait(100)])
          .then(function (value) {
            expect(value).to.equal(100);
            done();
          });
      });

      it('should ignore functions that do not return promises', function (done) {
        Shakle.raceAll([wait(300), wait(200), (function() {return 100;})()])
          .then(function (value) {
            expect(value).to.deep.equal(200);
            done();
          });
      });

    });

    describe('resolveAll', function () {

      var wait = function (time) {
        return new Shakle(function(resolve) {
          setTimeout(function () {
            resolve(time);
          }, time);
        });
      };

      var shakledFn1 = function (input) {
        return new Shakle(function (resolve, reject) {
          fs.readFile(__dirname + input, 'utf-8', function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      };

      it('should resolve all the passed in functions', function (done) {
        Shakle.resolveAll([wait(200), wait(300), wait(100), wait(50), wait(150)])
          .then(function (value) {
            expect(JSON.stringify(value)).to.equal('[50,100,150,200,300]');
            done();
          });
      });

      it('should resolve only functions that return promises', function (done) {
        Shakle.resolveAll([(function(){return 200})(), wait(300), (function(){return 100})(), wait(50), wait(150)])
          .then(function (value) {
            expect(JSON.stringify(value)).to.equal('[50,150,300]');
            done();
          });
      });

      it('should count but not include rejections', function (done) {
        Shakle.resolveAll([shakledFn1('./tes.txt'), wait(300), wait(100), wait(50), wait(150)])
          .then(function (value) {
            expect(JSON.stringify(value)).to.equal('[50,100,150,300]');
            done();
          });
      });

    });
    
  });

});
