var Shakle = function() {
  this.state = 'pending';
};

Shakle.showCallStack = false;

// Shakle.prototype.check = function() {

// }

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