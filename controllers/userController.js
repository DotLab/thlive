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

	q.exec(function (err, docs) {
		if (err) return next(err);

		res.render('user_list', {
			title: 'Users',
			users: docs,
			user: req.session.user
		});
	});
};

exports.register_form = function (req, res, next) {
	return res.render('user_register_form', { title: 'Join Touhou! Live!' });
};

exports.register = function (req, res, next) {
	req.checkBody('name', 'Empty user name').notEmpty();
	req.checkBody('email', 'Invalid email').isEmail();
	req.checkBody('password', 'Empty password').notEmpty();

	req.sanitize('name').trim();
	req.sanitize('email').trim();

	var errors = req.validationErrors();

	if (!errors) errors = [];

	if (!/^[^\s\@]{1,20}$/.test(req.body.name))
		errors.push({ msg: 'User name should have a length between 1 and 20 and not have any spaces' });

	if (!/^.{6,}$/.test(req.body.password))
		errors.push({ msg: 'Password should have a length bigger than 6' });

	if (errors.length > 0) {
		return res.render('user_register_form', {
			title: 'Join Touhou! Live!',
			body: req.body,
			errors: errors
		});
	} else {
		hasher({ password: req.body.password }, function (err, pass, salt, hash) {
			if (err) return next(err);

			new User({
				name: req.body.name,
				email: req.body.email,
				salt: salt,
				hash: hash
			}).save(function (err, user) {
				if (err)
					return res.render('user_register_form', {
						title: 'Join Touhou! Live!',
						body: req.body,
						errors: [ err ]
					});

				return res.redirect(user.url_detail);
			});
		});
	}
};

exports.login_form = function (req, res, next) {
	return res.render('user_login_form', { title: 'Login Touhou! Live!' });
};

exports.login = function (req, res, next) {
	req.checkBody('email', 'Invalid email').isEmail();

	req.sanitize('email').trim();

	User.findOne({ email: req.body.email }, function (err, doc) {
		if (err)
			return res.render('user_register_form', {
				title: 'Login Touhou! Live!',
				body: req.body,
				errors: [ err ]
			});

		if (!doc)
			return res.render('user_register_form', {
				title: 'Login Touhou! Live!',
				body: req.body,
				errors: [{ msg: 'User "' + req.body.email + '" does not exist' }]
			});

		hasher({ password: req.body.password, salt: doc.salt }, function (err, pass, salt, hash) {
			if (err) return next(err);

			if (hash !== doc.hash)
				return res.render('user_register_form', {
					title: 'Login Touhou! Live!',
					body: req.body,
					errors: [{ msg: 'Wrong password' }]
				});

			req.session.regenerate(function () {
				req.session.user = doc;
				return res.redirect(doc.url_detail);
			});
		});
	});
};

exports.logout = function (req, res, next) {
	// destroy the user's session to log them out
	// will be re-created next request
	req.session.destroy(function(){
		return res.redirect('back');
	});
}

exports.detail = function (req, res, next) {
	User.findById(req.params.id, function (err, doc) {
		if (err) return next(err);

		return res.render('user_detail', {
			title: 'User: ' + doc.name,
			user: doc,
			isSelf: (req.session && req.session.user && req.session.user._id == doc._id)
		});
	});
};