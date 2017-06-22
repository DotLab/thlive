var hasher = require('pbkdf2-password')();
var recaptcha = require('express-recaptcha');

var User = require('../models/user');
var Image = require('../models/image');
var Comment = require('../models/comment');

var promiseHelper = require('./helpers/promiseHelper');

exports.list = function (req, res, next) {
	var day = 1000 * 60 * 60 * 24;
	var now = Date.now();
	var week = new Date(now - day * 7), 
		month = new Date(now - day * 30), 
		quarter = new Date(now - day * 90), 
		year = new Date(now - day * 360);

	var q = User.find();

	if (!req.query.range || req.query.range == 'week')
		q = q.find({ date_joined: { $gt: week } });
	else if (req.query.range == 'month')
		q = q.find({ date_joined: { $gt: month } });
	else if (req.query.range == 'quarter')
		q = q.find({ date_joined: { $gt: quarter } });
	else if (req.query.range == 'year')
		q = q.find({ date_joined: { $gt: year } });

	if (!req.query.sort || req.query.sort == 'requtation')
		q = q.sort('-requtation');
	else if (req.query.sort == 'new')
		q = q.sort('-date_joined');
	else if (req.query.sort == 'vote')
		q = q.sort('-count_vote');
	else if (req.query.sort == 'edit')
		q = q.sort('-count_edit');

	q.populate('avatar').exec().then(docs => {
		res.render('user/list', {
			title: 'Users',
			section: 'users',

			users: docs
		});
	}).catch(err => next(err));
};

exports.detail = function (req, res, next) {
	User.findById(req.params.id).populate('avatar').then(doc => {
		res.render('user/detail', {
			title: doc.name,
			section: 'users',

			user: doc
		});
	}).catch(err => next(err));
};

exports.detail_activity = function (req, res, next) {
	User.findById(req.params.id).populate('avatar').then(doc => {
		res.render('user/detail_activity', {
			title: doc.name,
			section: 'users',

			user: doc
		});
	}).catch(err => next(err));
};

exports.signup_form = function (req, res, next) {
	res.render('user/signup', { 
		title: 'Join THLIVE',
		section: 'users',
		recaptcha: recaptcha.render()
	});
};

exports.signup = function (req, res, next) {
	req.checkBody('name', 'Empty user name').notEmpty();
	req.checkBody('email', 'Invalid email').isEmail();
	req.checkBody('password', 'Empty password').notEmpty();

	req.sanitizeBody('name').trim();
	req.sanitizeBody('email').trim();

	var errs = req.validationErrors();

	if (!errs) errs = [];

	if (!/^[^\s\@]{1,20}$/.test(req.body.name))
		errs.push({ msg: 'User name should have a length between 1 and 20 and not have any spaces' });

	if (!/^.{6,}$/.test(req.body.password))
		errs.push({ msg: 'Password should have a length bigger than 6' });

	if (errs.length > 0) {
		return res.render('user/signup', {
			title: 'Join THLIVE',
			errors: errs
		});
	}

	var p = new Promise((resolve, reject) => {
		hasher({ password: req.body.password }, function (err, pass, salt, hash) {
			if (err) reject(err);
			else resolve({ pass, salt, hash });
		});
	});

	p.then(({ pass, salt, hash }) => {
		return new User({
			name: req.body.name,
			email: req.body.email,
			salt: salt,
			hash: hash
		}).save();
	}).then(user => {
		res.redirect(user.url_detail);
	}).catch(err => {
		res.render('user/signup', {
			title: 'Join THLIVE',
			error: err
		});
	});
};

exports.login_form = function (req, res, next) {
	res.render('user/login', { 
		title: 'Login THLIVE',
		section: 'users',
		recaptcha: recaptcha.render()
	});
};

exports.login = function (req, res, next) {
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
			res.redirect(user.url_detail);
		});
	}).catch(err => {
		res.render('user/login', {
			title: 'Login THLIVE',
			error: err
		});
	});
};

// destroy the user's session to log them out
// will be re-created next request
exports.logout = function (req, res, next) {
	req.session.destroy(function () {
		return res.redirect('/');
	});
}
