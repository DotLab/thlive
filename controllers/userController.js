var hasher = require('pbkdf2-password')();

var User = require('../models/user');

exports.signup = function (req, res, next) {
	res.render('users/signup', { 
		title: 'Join THLIVE'
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
		doc.date_active = Date.now();
		doc.save();

		req.session.regenerate(function (err) {
			if (err) throw err;

			req.session.user = {
				_id: doc._id,
				name: doc.name,
				url: doc.url
			};
			res.redirect(doc.url);
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
exports.logout_post = function (req, res, next) {
	req.session.destroy(function (err) {
		if (err) return next(err);

		res.redirect('/');
	});
}

exports.list = function (req, res, next) {
	User.find().then(docs => {
		res.render('users/list', {
			title: 'Users',
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
			user: doc
		});
	}).catch(err => next(err));
}

// /users/editor
exports.editor = function (req, res, next) {
	User.findById(req.session.user._id).then(doc => {
		res.render('users/editor', {
			title: doc.name,
			body: doc
		});
	}).catch(err => next(err));
}

exports.editor_post = function (req, res, next) {
	req.checkBody('avatar', 'not an id').optional({ checkFalsy: true }).isMongoId();
	req.checkBody('name', 'name must be choosen from English, Chinese, or Japanese').notEmpty().matches(/^[a-zA-Z0-9 \u3040-\u309f\u30a0-\u30ff\u4E00-\u9FFF\uF900-\uFAFF]{1,20}$/);
	req.checkBody('title', 'too long').notEmpty().isLength({ max: 100 });
	req.checkBody('location', 'too long').notEmpty().isLength({ max: 100 });
	req.checkBody('markdown', 'too long').optional({ checkFalsy: true }).isLength({ max: 1000 });

	new Promise((resolve, reject) => {
		var errs = req.validationErrors();
		if (errs && errs[0]) reject(errs[0]);
		else resolve();
	}).then(() => {
		return User.findByIdAndUpdate(req.session.user._id, {
			avatar: req.body.avatar || undefined,
			name: req.body.name,
			title: req.body.title,
			location: req.body.location,
			markdown: req.body.markdown,
			date_active: Date.now()
		});
	}).then(doc => {
		res.redirect(doc.url);
	}).catch(err => {
		res.render('users/editor', {
			title: 'Join THLIVE',
			user: req.body,
			error: err
		});
	});
};