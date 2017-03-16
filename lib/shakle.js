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

Shakle.raceAll = function () {
  var args = Array.prototype.slice.call(arguments)[0];
  return new Shakle(function (resolve) {
    var res = false;
    args.forEach(function (promise) {
      if (promise.then) {
        promise.then(function(value) {
          if (!res) {
            res = true;
            resolve(value);
          }
        });
      }
    });
  });
};

Shakle.resolveAll = function() {
  var args = Array.prototype.slice.call(arguments)[0];
  
  return new Shakle(function (resolve) {
    var awaitCount = 0;
    var resCount = 0;
    var resArray = [];
    args.forEach(function (promise, index) {
      if (promise.then) {
        awaitCount++;
        promise
          .then(function (value) {
            resCount++;
            resArray.push(value);
            if (awaitCount === resCount) {
              resolve(resArray);
            }
          })
          .catch(function () {
            resCount++;
            if (awaitCount === resCount) {
              resolve(resArray);
            }
          });
      }
    });

  });

};

module.exports = Shakle;
