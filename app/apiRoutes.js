var express = require('express');
var passport = require('passport');
var User = require('./models/user');
var Game = require('./models/game');
var router = express.Router();
var _ = require('lodash');
var jwt    = require('jsonwebtoken'); 
var securityConfig = require('../config/security');

function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.session.redirectTo = req.path;
    res.redirect('/login');
}

// NEW API ROUTES

router.route('/authenticate')

    .post(passport.authenticate('local'), function(req, res) {
        // TODO: how do we send a response for failed authentication?
        console.log(req);
        console.log("Logged in as " + req.body.username);
        
        var token = jwt.sign(req.user.username, securityConfig.secret, {
            expiresInMinutes: 1440 // expires in 24 hrs
        });
        
        console.log("Generated token " + token);

        res.json({
            success: true,
            token: token
        })
    });

router.route('/users')

    // Get all users
    // TODO: dev only
    .get(function(req, res){
        User.find({}, function(err, games) {
            res.json(games);
        });
    })

    // Create a user
    .post(function(req, res) {
        User.register(new User({ username : req.body.username }), req.body.password, function(err, User) {
            if (err) {
                // TODO: better error handling
                return res.json({
                    success: false
                });
            }

            passport.authenticate('local')(req, res, function () {
                return res.json({
                    success: true
                });
            });
        });
    });

router.route('/games')

    // Get all games
    .get(function(req, res){
        Game.find({}, function(err, games) {
            res.json(games);
        });
    })

    // Create a game
    .post(function(req, res){
        // TODO: implement.
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

router.route('/games/:game_id')

    .get(function(req, res) {
        //  Get the game
        var gameId = req.params.game_id;
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
    });


// Protected the api with token authentication
router.use(function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, securityConfig.secret, function(err, decoded) {
            if (err) {
                console.log("Failed to authenticate token " + token);
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                console.log("Token OK");
                req.decoded = decoded;
                // TODO: attach the user to the request
                next();
            }
        });
    } else {
        console.log("No token provided");
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        })
    }
});

module.exports = router;