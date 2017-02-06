var Shakle = function (fn) {
  var state = 'pending';
  var value;
  var deferred = null;

  function resolve (newValue) {
    if(newValue && typeof newValue.then === 'function') {
      newValue.then(resolve);
      return;
    }

    value = newValue;
    state = 'resolved';

    if (deferred) {
      handle(deferred);
    }
  }

  function handle (handler) {
    if (state === 'pending') {
      deferred = handler;
      return;
    }

    if (!handler.onResolved) {
      handler.resolve(value);
      return;
    }

    var ret = handler.onResolved(value);
    handler.resolve(ret);
  }

  this.then = function (onResolved) {
    return new Shakle(function (resolve) {
      handle({
        onResolved: onResolved,
        resolve: resolve
      });
    });
  };

  if (fn) {
    fn(resolve);
  }
};

Shakle.showCallStack = false;

// internal functions

// external functions

Shakle.promisify = function() {
  return new this();
};

Shakle.promisifyAll = function() {
  return new this();
};
// takes in a single function
// throws error if it is not in the correct format
// mabye so it can be used with sync stuff in chain all, it just returns the same function if it violatess the format

Shakle.resolveAll = function() {


  // function doSomething() {  
  //   return new Shakle(function(resolve) {

  //     // invoke the promise, save it in a varible
  //     // check that the return value is an instance of shakle
  //     // if it is, invoke then() with the special callback
      
  //     promisifiedFetch1().then(function(value) { 
  //       // add it to its spot in the array
  //       // if the array is full of its values, resolve the array
  //     });
  //     promisifiedFetch2().then();
  //     promisifiedFetch3().then();
  //     promisifiedFetch4().then();
  //     promisifiedFetch5().then();

  //     resolve();

  //   });
  // }

  return new this();
};
// will only wait for those which return promises (of the shakle class?) 


module.exports = Shakle;

// Shakle.showCallStack
var fs = require('fs');


// function doSomething() {  
//   return new Shakle(function(resolve) {
//     setTimeout(function () {
//       var value = 42;
//       resolve(value);
//     }, 1000);
//   });
// }

// doSomething()
//   .then(function(value) {
//     console.log(value);
//   });









