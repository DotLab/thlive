var User = require('../../models/user');

forbid = function (res) {
	res.status(418);

	res.render('error', { 
		title: 'Error', 
		error: { name: 'Error', message: 'I\'m a teapot', stack: 'You attempt to brew coffee with a teapot.' }
	});
}

exports.visitor = function () {
	return function (req, res, next) {
		if (req.session.user) {
			next();
		} else {
			forbid(res);
		}
	};
};

exports.user = function () {
	return function (req, res, next) {
		if (req.session.user) {
			forbid(res);
		} else {
			next();
		}
	};
};