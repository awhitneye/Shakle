var Shakle = function() {
  this.state = 'pending';
};

Shakle.showCallStack = false

// Shakle.prototype.check = function() {

// }

Shakle.promisify = function() {
  return new this();
};

Shakle.all = function() {
  return new this();
};


module.exports = Shakle;

//Shakle.showCallStack