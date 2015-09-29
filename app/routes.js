var express = require('express');
var passport = require('passport');
var Account = require('./models/user');
var router = express.Router();

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.session.redirectTo = req.path;
  res.redirect('/login');
}

router.get('/', ensureAuthenticated, function(req, res){
	console.log(req.user);
  	res.sendfile('pages/index.html');
});

router.get('/register', function(req, res){
  	res.sendfile('pages/register.html');
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
            return res.render('register', { account : account });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res){
  	res.sendfile('pages/login.html');
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect(req.session.returnTo || '/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

module.exports = router;