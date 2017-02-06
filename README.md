# Shakle
#### A vanilla JS promise library to help with your asynchronous todo list!

![ShakleLogo2](https://raw.githubusercontent.com/dylanlrrb/Shakle/master/Shakle2.png)

---

### Shakle is a lightwihgt module that gives you the access to a promise class and some useful methods. All in pure Javascript!

> DISCLAIMER: The promise class provided almost meets all the specs outlined in [Promise/A+ spec](https://promisesaplus.com/). While this module is completly functional, it is primarily for educational purposes.

##### You have access to:
  - The Shakle (promise) class
  - The .promisify() method
  - The .raceAll() method
  - The .resolveAll method

## Usage
---

Get started by requiring Shakle
```sh
var Shakle = require('shakle.js');
```

Now you can start chaining together your TODO!
(get it? 'chain together'?? shakle??? ...shutup, it's clever.)
```sh
var resolveValue = function (value) {
    return new Shakle(function(resolve) {
        resolve(value);
    });
}
```
The invocation of resolveValue returns a promise with a .then() method which takes a callback to invoke on the value that resolves from the Promise
```sh
resolveValue(2)
    .then(function(value) {
        console.log(value)
    })
//logs 2 to the console
```
What makes Promises so special is that they invoke the callback passed to .then() on the resolved value WHENEVER IT COMES BACK!
An example is in order:
```sh
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
```sh
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
As might have noticed, the return value of a callback is passed down to the the input of the callback in the .then() chained below it
But what if the callback returns a Promise rather than a resolved value?
Well, this promise class is smart enough to recognize this and try to resolve it with the callback in the .then() chained below.
Check it out:
```sh
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
```sh
var fs = require('fs');

var shakledReadFile = Shakle.promisify(fs.readFile);
```
The returned function still takes in the non callback parameters like so:
```sh
shakledReadFile('alphabet.txt', 'utf-8')
    .then(function(data) {
        console.log(data)
    })
// logs the contents of alphabet.txt whenever the file system is finished being read
```
Then you could chain together various synchronous and asynchronous functions to process the file contents further:
```sh
shakledReadFile('alphabet.txt', 'utf-8')
    .then(parse)
    .then(sort)
    .then(doSomethingElse)
```
Keep in mind that the callback that .promisify() abstracts away needs to be in the form:
```sh
function(err, result) {
    // ...
}
```
### Error Handling
---
One other method on a promise object along with .then() is .catch()
.catch() accepts a callback that does something with errors that are thrown in the callback chain\
Lets look at how .catch() works:
```sh
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
The Error will be passed all the way down the chain, one .catch()at the end will catch all handled errors
```sh  
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
Race all is an interesting built-in function that takes in an array 

