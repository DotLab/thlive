var hasher = require('pbkdf2-password')();

var User = require('../models/user');

exports.list = function (req, res, next) {
	var q = User.find();

	if (req.query.sort != null)
		q = q.sort(req.query.sort);
	else
		q = q.sort('-reputation');
	
	if (req.query.skip != null)
		q = q.skip(parseInt(req.query.skip));

	if (req.query.limit != null)
		q = q.limit(parseInt(req.query.limit));
	else
		q = q.limit(20);

	if (req.query.populate != null)
		q = q.populate(req.query.populate);

	q.exec((err, docs) => {
		if (err) return next(err);

		res.render('user/list', {
			title: 'Users',
			users: docs,
			user: req.session.user
		});
	});
};

exports.register_form = function (req, res, next) {
	res.render('user/register', { title: 'Join THLIVE', body: req.body });
};

exports.register = function (req, res, next) {
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
		return res.render('user/register', {
			title: 'Join THLIVE',
			body: req.body,
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
		res.render('user/register', {
			title: 'Join THLIVE',
			body: req.body,
			error: err
		});
	});
};

exports.login_form = function (req, res, next) {
	res.render('user/login', { title: 'Login THLIVE', body: {} });
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
			body: req.body,
			error: err
		});
	});
};

// destroy the user's session to log them out
// will be re-created next request
exports.logout = function (req, res, next) {
	req.session.destroy(function () {
		return res.redirect('back');
	});
}

exports.detail = function (req, res, next) {
	User.findById(req.params.id, (err, doc) => {
		if (err) return next(err);

		res.render('user/detail', {
			title: 'User: ' + doc.name,
			user: doc,
			isSelf: (req.session && req.session.user && req.session.user._id == doc._id)
		});
	});
};