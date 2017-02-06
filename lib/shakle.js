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

  fn(resolve);

};

Shakle.showCallStack = false;

// internal functions

// external functions

Shakle.promisify = function() {
  return new this();
};
// takes in a single function or an array of functions
// throws error if it is not in the correct format
// mabye so it can be used with sync stuff in chain all, it just returns the same function if it violatess the format

Shakle.resolveAll = function() {
  return new this();
};
// will only wait for those which return promises (of the shakle class?) 

Shakle.chainAll = function() {
  return new this();
}; 
// take in aguments if applicable
// what if it doesnt take a callback and just needs to process it as an intermediate step?


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

