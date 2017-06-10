var Artist = require('../models/artist');

exports.list = function (req, res, next) {
	var q = Artist.find();

	if (req.query.sort != null)
		q = q.sort(req.query.sort);
	else
		q = q.sort('name');
	
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

		res.render('artist/list', {
			title: 'Artists',
			artists: docs,
			user: req.session.user
		});
	});
};

exports.add_form = function (req, res, next) {
	res.render('artist/add', { title: 'Add Artist', body: {} });
};

exports.add = function (req, res, next) {
	req.checkBody('name', 'Empty artist name').notEmpty();
	req.checkBody('homepage', 'Homepage address is not a URL').isURL();

	req.sanitize('name').trim();
	req.sanitize('homepage').trim();

	var errors = req.validationErrors();

	if (errors)
		return res.render('artist/add', { title: 'Add Artist', body: req.body, errors: errors });

	new Artist({
		name: req.body.name,
		homepage: req.body.homepage
	}).save(function (err, doc) {
		if (err)
			return res.render('artist/add', { title: 'Add Artist', body: req.body, error: err });

		res.redirect(doc.url_detail);
	});
};

exports.detail = function (req, res, next) {
	Artist.findById(req.params.id, function (err, doc) {
		if (err) return next(err);

		res.render('artist/detail', { title: 'Artist: ' + doc.name, artist: doc });
	});
};