// include chai
var chai = require('chai');
// define assesion library as variable
var expect = chai.expect;
// include the file to unit test
var Shakle = require('../lib/shakle.js');


describe('Shakle', function() {

 describe('The Shakle export', function() {
 
  it('should exist', function () {
    expect(Shakle).to.exist;
  });

  it('should return instantiate an Ojbject with a test property', function() {
    expect(new Shakle().test).to.equal('whatever');
  });

  it('should have a denode property that instantiates its own class', function() {
    expect(Shakle.denode().test).to.equal('whatever');
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