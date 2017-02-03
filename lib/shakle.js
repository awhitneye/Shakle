var Shakle = function() {
  this.test = 'whatever';
};

Shakle.denode = function() {
  return new this();
};

module.exports = Shakle;
