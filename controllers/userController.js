var hasher = require('pbkdf2-password')();

var User = require('../models/user');

exports.signup = function (req, res, next) {
	res.render('users/signup', {
		title: 'Join THLIVE'
	});
};

exports.signup_post = function (req, res, next) {
	req.checkBody('name').notEmpty().matches(/^[a-zA-Z0-9 \u3040-\u309f\u30a0-\u30ff\u4E00-\u9FFF\uF900-\uFAFF]{1,20}$/);
	req.checkBody('email').isEmail();
	req.checkBody('password', 'password too short').notEmpty().isLength({ min: 9 });

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
	}).then(() => {
		res.redirect('/login');
	}).catch(err => {
		res.render('users/signup', {
			title: 'Join THLIVE',
			error: err
		});
	});
};

exports.login = function (req, res, next) {
	res.render('users/login', { 
		title: 'Login THLIVE'
	});
};

exports.login_post = function (req, res, next) {
	User.findOne({ email: req.body.email }).then(user => {
		if (!user) throw new Error('Nonexistent user');

		return new Promise((resolve, reject) => {
			hasher({ password: req.body.password, salt: user.salt }, function (err, pass, salt, hash) {
				if (err) reject(err);
				else if (hash != user.hash) reject(new Error('Wrong password'));
				else resolve(user);
			});
		});
	}).then(user => {
		user.update({ active_date: Date.now() }).exec();

		req.session.regenerate(function (err) {
			if (err) throw err;

			req.session.user = {
				_id: user._id,
				name: user.name,
				url: user.url
			};

			res.redirect(user.url);
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
	req.session.destroy(function (err) {
		if (err) return next(err);

		res.redirect('/');
	});
};

exports.list = function (req, res, next) {
	User.find().then(users => {
		res.render('users/list', {
			title: 'Users',
			users: users
		});
	}).catch(err => next(err));
};

// /users/:id
exports.detail = function (req, res, next) {
	User.findById(req.params.id).then(user => {
		if (!user) throw new Error('Nonexistent user: ' + req.params.id);

		user.update({ $inc: { views: 1 } }).exec();

		res.render('users/detail', {
			title: user.name,
			user: user
		});
	}).catch(err => next(err));
};

// /users/:id/edit
exports.edit = function (req, res, next) {
	if (req.params.id != req.bindf.user._id)
		return res.redirect(req.bindf.user.url);

	res.render('users/edit', {
		title: req.bindf.user.name,
		body: req.bindf.user
	});
};

// /users/:id/edit
exports.edit_post = function (req, res, next) {
	if (req.params.id != req.bindf.user._id)
		return res.redirect(req.bindf.user.url);

	req.checkBody('name').notEmpty().matches(/^[a-zA-Z0-9 \u3040-\u309f\u30a0-\u30ff\u4E00-\u9FFF\uF900-\uFAFF]{1,20}$/);
	req.checkBody('title').notEmpty();
	req.checkBody('location').notEmpty();

	new Promise((resolve, reject) => {
		var errs = req.validationErrors();
		if (errs && errs[0]) reject(errs[0]);
		else resolve();
	}).then(() => {
		res.redirect(req.bindf.user.url);

		req.bindf.user.update({
			name: req.body.name,
			title: req.body.title,
			location: req.body.location,
			website: req.body.website,

			about_me: req.body.about_me,
			active_date: Date.now()
		}).exec();
	}).catch(err => {
		res.render('users/edit', {
			title: 'Join THLIVE',
			user: req.body,
			error: err
		});
	});
};