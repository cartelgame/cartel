var express = require('express');
var passport = require('passport');
var User = require('./models/user');
var Game = require('./models/game');
var router = express.Router();
var _ = require('lodash');
var jwt = require('jsonwebtoken'); 
var securityConfig = require('../config/security');

function ensureAuthenticated (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        jwt.verify(token, securityConfig.secret, function(err, decoded) {
            if (err) {
                console.log("Failed to authenticate token " + token);
                return res.status(403).send('Failed to authenticate token');
            } else {
                console.log("Token OK");
                // Attach the user to the request
                console.log(decoded);
                req.user = decoded;
                next();
            }
        });
    } else {
        console.log("No token provided");
        return res.status(403).send('No token provided.');
    }
}

// NEW API ROUTES

router.route('/authenticate')

    .post(passport.authenticate('local'), function(req, res) {
        // TODO: how do we send a response for failed authentication?
        console.log("Logged in as " + req.user.username);

        // Create an option to use as the token
        var userInfo = {
            username: req.user.username,
            hash: req.user.hash
        };
        
        var token = jwt.sign(userInfo, securityConfig.secret, {
            expiresIn: '1h' // expires in 24 hrs
        });
        
        console.log("Generated token " + token);

        res.json({
            success: true,
            token: token
        });
    });

router.route('/users')

    // Get all users
    // TODO: dev only
    .get(ensureAuthenticated, function(req, res){
        User.find({}, function(err, games) {
            res.json(games);
        });
    })

    // Create a user
    .post(function(req, res) {
        User.register(new User({ username : req.body.username }), req.body.password, function(err, User) {
            if (err) {
                // TODO: better error handling
                console.log(err);
                return res.status(500).send(err.message);
            }

            passport.authenticate('local')(req, res, function () {
                return res.status(200).send('User successfully created');
            });
        });
    });

router.route('/games')

    // Get all games
    .get(ensureAuthenticated, function(req, res){
        Game.find({}, function(err, games) {
            res.json(games);
        });
    })

    // Create a game
    .post(ensureAuthenticated, function(req, res){
        // TODO: implement.
        console.log("Creating game");

        var gameData = req.body;
        gameData.owner = req.user.username;
        gameData.players = [{
            name: req.user.username,
            ready: false
        }];
        console.log(gameData);

        Game.find(gameData, function(err, games) {
            if (games && games.length) {
                console.log(games);
                // Game already exists
                console.log("Game already exists");
                res.status(400).send('Game already exists');
            } else {
                var myGame = new Game(gameData);
                myGame.save(function(err, game) {
                    if (err) {
                        throw err;
                    }

                    console.log("Game %d saved", game._id);
                    res.json(game);
                });
            }
        });
    });

router.route('/games/:game_id')

    // Get a specific game
    .get(ensureAuthenticated, function(req, res) {
        //  Get the game
        var gameId = req.params.game_id;
        console.log("Looking for game " + gameId);
        Game.findOne({_id: gameId}, function(err, game) {
            if (!game) {
                console.log("Can't find the game");
                res.status(404).send("Game not found");
                return;
            }

            console.log("Found game");

            // Deny the user access if they are banned from the game
            if (_.contains(game.bannedPlayers, req.user.username)) {
                res.status(403).send("The user is banned from the game");
                return;
            }

            if (req.user.username != game.owner) {
                // Add the user to the players list
                if (!_.find(game.players, {name: req.user.username})) {
                    game.players.push({name: req.user.username, ready: false});
                }
                
                // Persist the new players list
                Game.update({_id: game._id}, {players: game.players}, function(err, game) {
                    console.log("Game updated");
                });
            }

            // TODO: need to emit to the socket to say the player has joined?
            // or should joining be carried out separately and be initiated by the client via socket?
            res.json(game);
        });
    })

    .delete(ensureAuthenticated, function(req, res) {
        Game.findOne({_id: req.params.game_id}).remove().exec();
        res.status(200).send("Game deleted successfully");
    });

module.exports = router;