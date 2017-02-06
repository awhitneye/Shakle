var Shakle = function (fn) {
  var state = 'pending';
  var value;
  var deferred = null;

  function resolve (newValue) {
    try {
      if(newValue && typeof newValue.then === 'function') {
        newValue.then(resolve);
        return;
      }

      value = newValue;
      state = 'resolved';

      if (deferred) {
        handle(deferred);
      }
    } catch (err) {
      throw err;
    }
      
  }

  function reject(reason) {
    state = 'rejected';
    value = reason;
    
    if(deferred) {
      handle(deferred);
    }
  }

  function handle (handler) {
    if (state === 'pending') {
      deferred = handler;
      return;
    }

    var handlerCallback;

    if(state === 'resolved') {
      handlerCallback = handler.onResolved;
    } else {
      handlerCallback = handler.onRejected;
    }

    if (!handlerCallback) {
      if (state === 'resolved') {
        handler.resolve(value);
      } else {
        handler.reject(value);
      }

      return;
    }

    var ret;
    if(handler.onResolved) {

      ret = handler.onResolved(value);
      handler.resolve(ret);
    } else if (handler.onRejected) {

      value = Shakle.showCallStack ? value : value.stack;

      ret = handler.onRejected(value);
      handler.reject(ret);
    } 
  }

  this.then = function (onResolved) {
    return new Shakle(function (resolve, reject) {
      handle({
        onResolved: onResolved,
        resolve: resolve,
        reject: reject
      });
    });
  };

  this.catch = function (onRejected) {
    return new Shakle(function (resolve, reject) {
      handle({
        onRejected: onRejected,
        resolve: resolve,
        reject: reject
      });
    });
  };

  if (fn) {
    fn(resolve, reject);
  }
};

// // // // // //

Shakle.promisify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    return new Shakle(function (resolve, reject) {
      var cb = function (err, data) {if (err) {reject(err);}else{resolve(data);}};
      args.push(cb);
      
      fn.apply(this, args); 

    });
  };
};

Shakle.promisifyAll = function () {
  return new this();
};
// takes in a single function
// throws error if it is not in the correct format
// mabye so it can be used with sync stuff in chain all, it just returns the same function if it violatess the format

Shakle.raceAll = function () {
  return new this();
};

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
