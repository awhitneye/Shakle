// include chai
var chai = require('chai');
// define assesion library as variable
var expect = chai.expect;
// include the file to unit test
var Shakle = require('../lib/shakle.js');


describe('Shakle', function() {

 describe('Existance and Instantiation', function() {
 
  it('should exist', function () {
    expect(Shakle).to.exist;
  });

  // it('the function should return the string "hello"', function () {
  //   var promise = Shakle;
  //   expect(promise()).to.equal('hello');
  // });

 });

});

// range class
// lrucache
// asyncmap

// SPECS: 
//