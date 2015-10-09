var express = require('express');
var passport = require('passport');
var Account = require('./models/user');
var Game = require('./models/game');
var router = express.Router();
var _ = require('lodash');
var jwt    = require('jsonwebtoken'); 
var securityConfig = require('../config/security');

router.get('/', function(req, res){
	console.log(req.user);
  	res.sendfile('index.html');
});

module.exports = router;