var hasher = require('pbkdf2-password')();

var User = require('../models/user');

exports.signup = function (req, res, next) {
	res.render('users/signup', { 
		title: 'Join THLIVE',
		section: 'users'
	});
};

exports.signup_post = function (req, res, next) {
	req.checkBody('name', 'name must be choosen from English, Chinese, or Japanese').notEmpty().matches(/^[a-zA-Z0-9 \u3040-\u309f\u30a0-\u30ff\u4E00-\u9FFF\uF900-\uFAFF]{1,20}$/);
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

exports.list = function (req, res, next) {
	User.find().then(docs => {
		res.render('users/list', {
			title: 'Users',
			section: 'users',
			users: docs
		});
	}).catch(err => next(err));
}

// /users/:id
exports.detail = function (req, res, next) {
	User.findById(req.params.id).then(doc => {
		if (!doc) throw new Error('Nonexistent user: ' + req.params.id);

		res.render('users/detail', {
			title: doc.name,
			section: 'users',
			user: doc
		});
	}).catch(err => next(err));
}
