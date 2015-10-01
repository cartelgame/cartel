var express = require('express');
var passport = require('passport');
var Account = require('./models/user');
var Game = require('./models/game');
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

router.get('/games', ensureAuthenticated, function(req, res){
    Game.find({}, function(err, games) {
        res.json(games);
    });
});

router.post('/game', ensureAuthenticated, function(req, res) {
    console.log("Creating game");

    
    var gameProperties = req.body;
    console.log(gameProperties);
    gameProperties.owner = req.session.passport.user;
    console.log(gameProperties);

    Game.find(gameProperties, function(err, games) {
        if (games && games.length) {
            console.log(games);
            // Game already exists
            console.log("Game already exists");
            res.status(400).send('Game already exists');
        } else {
            var myGame = new Game(gameProperties);
            myGame.save(function(err, game) {
                if (err) {
                    throw err;
                }

                console.log("Game saved");

                console.log(game);

                // TODO: should probably return a success message and allow the client to redirect the user
                res.json(game);
                // res.redirect('/#/games/' + game._id);
            });
        }
    });
});


module.exports = router;