var Shakle = function (fn) {
  var state = 'pending';
  var value;
  var deferred;

  function resolve (newValue) {
    value = newValue;
    state = 'resolved';

    if (deferred) {
      handle(deferred);
    }
  }

  function handle (onResolved) {
    if (state === 'pending') {
      deferred = onResolved;
      return;
    }
    onResolved(value);
  }

  this.then = function (onResolved) {
    handle(onResolved);
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


function doSomething() {  
  return new Shakle(function(resolve) {
    setTimeout(function () {
      var value = 42;
      resolve(value);
    }, 1000);
  });
}

doSomething()
  .then(function(value) {
    console.log(value);
  });









