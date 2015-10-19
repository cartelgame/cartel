var jwt = require('jsonwebtoken'); 

var token = jwt.sign({name: 'hello', hash: '234tergesthdhe4y'}, 'supersecret', { expiresIn: 20});
console.log(token);

var decoded = jwt.verify(token, 'supersecret');
console.log(decoded);