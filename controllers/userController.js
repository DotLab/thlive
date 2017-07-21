var hasher = require('pbkdf2-password')();
var request = require('request');

var User = require('../models/user');


exports.signup_form = function (req, res, next) {
	if (req.session.user)
		return res.redirect('/');

	res.render('users/signup', { 
		title: 'Join THLIVE',
		section: 'users'
	});
};

exports.signup = function (req, res, next) {
	if (req.session.user)
		return res.redirect('/');

	req.checkBody('name', 'Empty user name').notEmpty();
	req.checkBody('email', 'Invalid email').isEmail();
	req.checkBody('password', 'Empty password').notEmpty();

	req.sanitizeBody('name').trim();
	req.sanitizeBody('email').trim();

	var errs = req.validationErrors();

	if (!errs) errs = [];

	if (!/^[^\s\@]{1,20}$/.test(req.body.name))
		errs.push({ name: 'name', message: 'User name should have a length between 1 and 20 and not have any spaces' });

	if (!/^.{6,}$/.test(req.body.password))
		errs.push({ name: 'password', message: 'Password should have a length bigger than 6' });

	if (errs.length > 0) {
		return res.render('users/signup', {
			title: 'Join THLIVE',
			errors: errs
		});
	}

	new Promise((resolve, reject) => {
		hasher({ password: req.body.password }, function (err, pass, salt, hash) {
			if (err) 
				reject(err);
			else 
				resolve({ pass, salt, hash });
		});
	}).then(({ pass, salt, hash }) => {
		return new User({
			name: req.body.name,
			email: req.body.email,
			salt: salt,
			hash: hash
		}).save();
	}).then(user => {
		res.redirect('/');
	}).catch(err => {
		res.render('users/signup', {
			title: 'Join THLIVE',
			error: err
		});
	});
};

exports.login_form = function (req, res, next) {
	if (req.session.user)
		return res.redirect('/');

	res.render('users/login', { 
		title: 'Login THLIVE',
		section: 'users'
	});
};

exports.login = function (req, res, next) {
	if (req.session.user)
		return res.redirect('/');

	req.checkBody('email', 'Invalid email').isEmail();

	req.sanitizeBody('email').trim();

	User.findOne({ email: req.body.email }).exec().then(doc => {
		if (!doc) throw new Error('Nonexistent user');

		return new Promise((resolve, reject) => {
			hasher({ password: req.body.password, salt: doc.salt }, function (err, pass, salt, hash) {
				if (err) 
					reject(err);
				else if (hash != doc.hash) 
					reject(new Error('Wrong password'));
				else
					resolve(doc);
			});
		});
	}).then(user => {
		req.session.regenerate(function () {
			req.session.user = user;
			res.redirect('/');
		});
	}).catch(err => {
		res.render('users/login', {
			title: 'Login THLIVE',
			error: err
		});
	});
};

// destroy the user's session to log them out
// will be re-created next request
exports.logout = function (req, res, next) {
	// return res.redirect('/');

	req.session.destroy(function () {
		return res.redirect('/');
	});
}
