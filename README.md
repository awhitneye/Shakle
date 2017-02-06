# Shakle
#### A vanilla JS promise library to help with your asynchronous todo list!

![ShakleLogo2](https://raw.githubusercontent.com/dylanlrrb/Shakle/master/Shakle2.png)

---

### Shakle is a lightwihgt module that gives you the access to a Promise class and some useful methods. All in pure Javascript!

> DISCLAIMER: The promise class provided almost meets all the specs outlined in [Promise/A+ spec](https://promisesaplus.com/). While this module is completly functional, it is primarily for educational purposes.

#### You have access to:
  - [The Shakle (Promise) class](https://github.com/dylanlrrb/Shakle/blob/master/README.md#usage)
  - [The .promisify() method](https://github.com/dylanlrrb/Shakle/blob/master/README.md#promisify)
  - [The .raceAll() method](https://github.com/dylanlrrb/Shakle/blob/master/README.md#raceall)
  - [The .resolveAll method](https://github.com/dylanlrrb/Shakle/blob/master/README.md#resolveall)

## Usage
---

Get started by requiring Shakle
```javascript
var Shakle = require('shakle.js');
```

Now you can start chaining together your TODO!

(get it? 'chain together'?? shakle??? ...shutup, it's clever.)
```javascript
var resolveValue = function (value) {
    return new Shakle(function(resolve) {
        resolve(value);
    });
}
```
The invocation of resolveValue returns a promise with a .then() method which takes a callback to invoke on the value that resolves from the Promise
```javascript
resolveValue(2)
    .then(function(value) {
        console.log(value)
    })
    
//logs 2 to the console
```
What makes Promises so special is that they invoke the callback passed to .then() on the resolved value WHENEVER IT COMES BACK!

An example is in order:
```javascript
var resolveValue = function (value) {
    return new Shakle(function(resolve) {
        setTimeout(function() {
             resolve(value);
        }, 1000);
    });
}

resolveValue(2)
    .then(function(value) {
        console.log(value)
    })
    
//logs 2 to the console ONE SECOND LATER!
```

This is a great way to deal with async functions in a clean, non-blocking way

Another powerful feature of promises is that the .then() method always returns another promise. 

This means you can keep chaining together functions indefinatly! WOW!

Check it out:
```javascript
var doubler = function(value) {
    return value * 2
}

resolveValue(2)
    .then(doubler)
    .then(doubler)
    .then(doubler)
    .then(doubler)
    .then(function(value) {
        console.log(value)
    })
    
//logs 32 to the console one second later
```
As you might have noticed, the return value of a callback is passed down to the the input of the callback in the .then() chained below it

But what if the callback returns a Promise rather than a resolved value?

Well, this promise class is smart enough to recognize this and try to resolve it with the callback in the .then() chained below.

Check it out:
```javascript
resolveValue(2)
    .then(doubler)
    .then(resolveValue)
    .then(doubler)
    .then(resolveValue)
    .then(doubler)
    .then(function(value) {
        console.log(value)
    })
    
//logs 16 to the console TWO SECONDS LATER!
```

## Built-in Methods
---
### .promisify()
.promisify() takes in a function that would take in a callback and returns a function that takes no callback and instead returns a promise

For example:
```javascript
var fs = require('fs');

var shakledReadFile = Shakle.promisify(fs.readFile);
```
The returned function still takes in the non callback parameters like so:
```javascript
shakledReadFile('alphabet.txt', 'utf-8')
    .then(function(data) {
        console.log(data)
    })
    
// logs the contents of alphabet.txt whenever the file system is finished being read
```
Then you could chain together various synchronous and asynchronous functions to process the file contents further:
```javascript
shakledReadFile('alphabet.txt', 'utf-8')
    .then(parse)
    .then(sort)
    .then(doSomethingElse)
```
Keep in mind that the callback that .promisify() abstracts away needs to be in the form:
```javascript
function(err, result) {
    // ...
}
```
### Error Handling
---
One other method on a promise object along with .then() is .catch()

.catch() accepts a callback that does something with errors that are thrown in the callback chain\

Lets look at how .catch() works:
```javascript
var shakledReadFile = function(input) {
    return new Shakle(function(resolve, reject) {
        fs.readFile(input, 'utf-8', function(err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        })
    })
}


shakledReadFile('tHe_WRonG_filEPAth.tXt')
    .catch(function(error) {
        console.log(error);
    });
    
// logs the error 
```
The callback passed into .catch() will be invoked with the argument (error) passed into reject 

The Error will be passed all the way down the chain, one .catch() at the end will catch all handled errors
```javascript
shakledReadFile('tHe_WRonG_filEPAth.tXt')
    .then(doubler)
    .then(resolveValue)
    .then(doubler)
    .catch(function(error) {
        console.log(error);
    });
    
// still logs the error 
```
##### At this time, this implementation of .catch() only catches handled errors that are explicitly passed to reject. Other errors may be silent. This is something I am working on fixing :)
---
### .raceAll()
.raceAll() is an interesting built-in function that takes in an array of promises ready to be resolved and resolves the value of which ever one finishes first!

.raceAll() ignores functions in the array that do not return promises when invoked

Let me show ya:
```javascript
var wait = function (time) {
    return new Shakle(function(resolve) {
        setTimeout(function () {
            resolve(time);
        }, time);
    });
 };
 
 Shakle.raceAll([wait(300), wait(100), wait(200)])
    .then(function(value) {
        console.log(value);
    });

// will log 100 only because it is the first function to resolve
```

###### I could see a possible use case for this where a client has several distributed servers it could connect to, so it pings all of them at once and connects to the one that is fastest to respond
---
## .resolveAll()
.resolveAll() is a function similar to race, but rather than resolving only the fastest, it resolves an array containing the values from the resolution from each of the promises passed in

.resolveAll() also ignores functions in the array that do not return Promises when invoked

ALSO! The promises are resolved in 'parallel' rather than in series so the resolution will only take as long as the slowest promise to resolve.

Observe:
```javascript
Shakle.resolveAll([wait(200), wait(300), wait(100), wait(50), wait(150)])
  .then(function (value) {
    console.log(value)
  });
  
 // will log '[50,100,150,200,300]'
```
###### handled errors are excluded from the resolved array but are not passed the .catch() callback... I'm working on this.
###### unexpected errors may cause .resolveAll() to never resolve... I'm working on this also.
---
### That's about it! thanks for checking out Shakle!




