var hasher = require('pbkdf2-password')();

var User = require('../models/user');

exports.signup = function (req, res, next) {
	res.render('users/signup', { 
		title: 'Join THLIVE',
		section: 'users'
	});
};

exports.signup_post = function (req, res, next) {
	req.checkBody('name').notEmpty().matches(/^[^ ].{0,30}$/);
	req.checkBody('uuid').notEmpty().matches(/^[a-z][a-z0-9\-]{0,30}$/);
	req.checkBody('email').isEmail();
	req.checkBody('password', 'password too short').notEmpty().matches(/^.{9,}$/);

	new Promise((resolve, reject) => {
		var errs = req.validationErrors();
		if (errs && errs[0]) reject(errs[0]);
		else resolve();
	}).then(() => {
		return new Promise((resolve, reject) => {
			hasher({ password: req.body.password }, function (err, pass, salt, hash) {
				if (err) reject(err);
				else resolve({ pass, salt, hash });
			});
		});
	}).then(({ pass, salt, hash }) => {
		return new User({
			name: req.body.name,
			uuid: req.body.uuid,
			email: req.body.email,
			salt: salt,
			hash: hash
		}).save();
	}).then(doc => {
		res.redirect('/login');
	}).catch(err => {
		res.render('users/signup', {
			title: 'Join THLIVE',
			section: 'users',
			error: err
		});
	});
};

exports.login = function (req, res, next) {
	res.render('users/login', { 
		title: 'Login THLIVE',
		section: 'users'
	});
};

exports.login_post = function (req, res, next) {
	User.findOne({ email: req.body.email }).then(doc => {
		if (!doc) throw new Error('Nonexistent user');

		return new Promise((resolve, reject) => {
			hasher({ password: req.body.password, salt: doc.salt }, function (err, pass, salt, hash) {
				if (err) reject(err);
				else if (hash != doc.hash) reject(new Error('Wrong password'));
				else resolve(doc);
			});
		});
	}).then(doc => {
		req.session.regenerate(function () {
			req.session.user = doc;
			res.redirect('/users/' + doc.uuid);
		});
	}).catch(err => {
		res.render('users/login', {
			title: 'Login THLIVE',
			section: 'users',
			error: err
		});
	});
};

// destroy the user's session to log them out
// will be re-created next request
exports.logout_post = function (req, res, next) {
	req.session.destroy(function () {
		res.redirect('/');
	});
}

// /users/:uuid
exports.detail = function (req, res, next) {
	User.findOne({ uuid: req.params.uuid }).then(doc => {
		if (!doc) doc = { 
			name: 'Veronica', 
			title: 'CEO, MicroVolt Inc.', 
			moderator: true, 
			reputation: 0, 
			badge_gold: 0, 
			badge_silver: 0, 
			badge_brozen: 0,
			vote_up: 0,
			vote_down: 0,
			edit: 0,
			view: 0,
			date_joined: new Date(0),
			date_active: new Date(Date.now()),
			location: 'Hyper Reality',
			markdown: 'I am **Alpha** and **Omega**, the beginning and the end, the first and the last.' };

		res.render('users/detail', {
			title: doc.name,
			section: 'users',
			user: doc
		});
	}).catch(err => next(err));
}