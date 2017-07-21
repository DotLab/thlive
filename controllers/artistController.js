var Artist = require('../models/artist');


exports.list = function (req, res, next) {
	Artist.find().then(docs => {
		res.render('artists/list', {
			title: 'Artists',
			section: 'artists',

			artists: docs
		});
	}).catch(err => next(err));
};

exports.detail = function (req, res, next) {
	Artist.findById(req.params.id).populate('avatar').then(doc => {
		res.render('artists/detail', {
			title: doc.name,
			section: 'artists',

			artist: doc
		});
	}).catch(err => next(err));
};

exports.editor = function (req, res, next) {
	if (req.query.for) {
		Artist.findById(req.query.for).populate('avatar').then(doc => {
			res.render('artists/editor', {
				title: 'Edit Artist ' + doc.name,
				section: 'artists',

				artist: doc
			});
		}).catch(err => next(err));
	} else {
		res.render('artists/editor', {
			title: 'New Artist',
			section: 'artists',

			artist: {}
		});
	}
};

exports.editor_post = function (req, res, next) {
	if (!req.body.avatar) delete req.body.avatar;

	if (req.query.for) {
		Artist.findByIdAndUpdate(req.query.for, req.body).then(doc => {
			res.redirect('/artists/' + doc._id);
		}).catch(err => next(err));
	} else {
		Artist.create(req.body).then(doc => {
			res.redirect('/artists/' + doc._id);
		}).catch(err => next(err));
	}
};
