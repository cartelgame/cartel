var express = require('express');
var router = express.Router();
var auth = require('./auth.js');

function restrict(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.session.error = 'Access denied!';
		req.session.returnTo = req.path;
		res.redirect('/login');
	}
}

router.get('/', restrict, function(req, res){
  	res.sendfile('pages/index.html');
});

router.get('/login', function(req, res){
  	res.sendfile('pages/login.html');
});

router.post('/login', function(req, res){
	auth.authenticate(req.body.username, req.body.password, function(err, user){
		if (user) {
			// Regenerate session when signing in
			// to prevent fixation
			req.session.regenerate(function(){
				// Store the user's primary key
				// in the session store to be retrieved,
				// or in this case the entire user object
				req.session.user = user;
				req.session.success = 'Authenticated as ' + user.name
					+ ' click to <a href="/logout">logout</a>. '
					+ ' You may now access <a href="/restricted">/restricted</a>.';
				var returnTo = req.session.returnTo ? req.session.returnTo : '/';
				delete req.session.returnTo;
				//is authenticated ?
				res.redirect(returnTo);
			});
		} else {
			req.session.error = 'Authentication failed, please check your '
				+ ' username and password.'
				+ ' (use "tj" and "foobar")';
			res.redirect('login');
		}
	});
});

module.exports = router;