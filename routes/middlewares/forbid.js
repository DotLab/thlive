forbid = function (res) {
	res.status(418);

	res.render('error', { 
		title: 'Error', 
		error: { name: 'Error', message: 'I\'m a teapot' }
	});
}

exports.visitor = function (req, res, next) {
	if (req.session.user) {
		next();
	} else {
		forbid(res);
	}
};

exports.user = function (req, res, next) {
	if (req.session.user) {
		forbid(res);
	} else {
		next();
	}
};

exports.other = function (req, res, next) {
	if (req.session.user && req.session.user._id == req.params._id) {
		next();
	} else {
		forbid(res);
	}
};
