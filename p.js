var log = function(string, callback) {
  callback(string);
};

var rev = function(string) {
  return string.split('').reverse().join('');
};

var Qlog = function(string) {
  return new Promise(function(resolve, reject) {
    log(string, resolve);
  });
};

var Qrev = function(string) {
  return new Promise(function(resolve, reject) {
    resolve(rev(string));
  });
};

Qrev('yikes').then(Qlog).then(console.log);

console.log('yo');
log('blah', console.log);
console.log(rev('??lll'));
Qrev('bubble').then(console.log);