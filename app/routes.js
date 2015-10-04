var express = require('express');
var passport = require('passport');
var Account = require('./models/user');
var Game = require('./models/game');
var router = express.Router();
var _ = require('lodash');

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectTo = req.path;
    res.redirect('/login');
}

router.get('/', function(req, res){
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

router.get('/games', function(req, res){
    Game.find({}, function(err, games) {
        res.json(games);
    });
});

// TODO: this should probably be done with sockets on connection
router.get('/game', function(req, res) {
    //  Get the game
    var gameId = req.query.gameId;
    console.log("Looking for game " + gameId);
    Game.find({_id: gameId}, function(err, game) {
        console.log("Found game");
        console.log(game);

        var user = req.session.passport.user;

        if (user.name != game.owner) {
            // Add the user to the players list
            game.players = _.union(game.players, [user.name]);
        }

        // TODO: need to emit to the socket to say the player has joined?

        res.json(game);
    });

    // TODO: Add the user to the game

    // TODO: Return the game data
});

router.get('/leavegame', ensureAuthenticated, function(req, res) {
    // TODO: Get the game

    // TODO: Remove the user to the game

    // TODO: Return success/failure
});

router.get('/kick', ensureAuthenticated, function(req, res) {
    // TODO: Get the game

    // TODO: Check if user is owner of game

    // TODO: Remove the user from the game

    // TODO: Return success/failure
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


// NEW API ROUTES

router.post('/api/authenticate', passport.authenticate('local'), function(req, res) {
    res.sendStatus(200);
});

module.exports = router;