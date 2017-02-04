var Shakle = function() {
  this.test = 'whatever';
};

Shakle.showCallStack = false

// Shakle.prototype.check = function() {

// }

Shakle.promisify = function() {
  return new this();
};


module.exports = Shakle;

//Shakle.showCallStack