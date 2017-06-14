var Artist = require('../models/artist');
var Comment = require('../models/comment');

exports.list = function (req, res, next) {
	Artist.find(function (err, docs) {
		if (err) return next(err);

		res.render('artist/list', {
			title: 'Artists',
			artists: docs
		});
	});
};

exports.add_form = function (req, res, next) {
	res.render('artist/add', { 
		title: 'Add Artist'
	});
};

exports.add = function (req, res, next) {
	req.checkBody('name', 'Empty artist name').notEmpty();
	req.checkBody('homepage', 'Homepage address is not a URL').isURL();

	req.sanitizeBody('name').trim();
	req.sanitizeBody('homepage').trim();

	var errors = req.validationErrors();

	if (errors) {
		return res.render('artist/add', { 
			title: 'Add Artist', 
			errors: errors
		});
	}

	Artist.create({
		name: req.body.name,
		homepage: req.body.homepage
	}, function (err, doc) {
		if (err) {
			return res.render('artist/add', { 
				title: 'Add Artist', 
				error: err
			});
		}

		res.redirect(doc.url_detail);
	});
};

exports.detail = function (req, res, next) {
	var ps = [
		Artist.findById(req.params.id),
		Comment.find({ topic: req.params.id }).sort('date').populate('user')
	];

	Promise.all(ps).then(function (results) {
		res.render('artist/detail', {
			title: 'Artist: ' + results[0].name,
			artist: results[0],
			comments: results[1]
		});
	}).catch(err => next(err));
};