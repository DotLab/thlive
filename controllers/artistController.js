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
	if (req.query.target) {
		Artist.findById(req.query.target).populate('avatar').then(doc => {
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
	if (req.query.target) {
		Artist.findByIdAndUpdate(req.query.target, req.body).then(doc => {
			res.redirect('/artists/' + doc._id);
		}).catch(err => next(err));
	} else {
		Artist.create(req.body).then(doc => {
			res.redirect('/artists/' + doc._id);
		}).catch(err => next(err));
	}
};
