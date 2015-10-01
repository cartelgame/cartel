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

router.get('/servers', function(req, res){
    console.log("Getting game servers for client");
    Game.find({}, function(err, games) {
        res.json(games);
    });
    // res.json([
    //     {
    //         name: 'game1'
    //     },
    //     {
    //         name: 'game2'
    //     }
    // ]);
});

router.post('/game', function(req, res) {
    console.log("Creating game");
    console.log(req.body);

    var results = Game.findByName(req.body.name, function(err, games) {
        console.log("Found games:");
        console.log(games);

        var gameProperties = req.body;
        gameProperties.owner = req.session.passport.user;

        var myGame = new Game(gameProperties);
        myGame.save(function(err, game) {
            if (err) {
                throw err;
            }

            console.log("Game saved");

            console.log(game);

            res.redirect('/#/servers/' + game._id);
            // res.json(game);
        });
    });
});


module.exports = router;