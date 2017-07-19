var Character = require('../models/character');


exports.list = function (req, res, next) {
	Character.find().then(docs => {
		res.render('characters/list', {
			title: 'Characters',
			section: 'characters',

			characters: docs
		});
	}).catch(err => next(err));
};

exports.detail = function (req, res, next) {
	Character.findById(req.params.id).populate('avatar').then(doc => {
		res.render('characters/detail', {
			title: doc.name_zh,
			section: 'characters',

			character: doc
		});
	}).catch(err => next(err));
};

exports.editor = function (req, res, next) {
	if (req.query.for) {
		Character.findById(req.query.for).populate('avatar').then(doc => {
			res.render('characters/editor', {
				title: 'Edit Character ' + doc.name_zh,
				section: 'characters',

				character: doc
			});
		}).catch(err => next(err));
	} else {
		res.render('characters/editor', {
			title: 'New Character',
			section: 'characters',

			character: {}
		});
	}
};

exports.editor_post = function (req, res, next) {
	if (!req.body.avatar) delete req.body.avatar;
	
	if (req.query.for) {
		Character.findByIdAndUpdate(req.query.for, req.body).then(doc => {
			res.redirect('/characters/' + doc._id);
		}).catch(err => next(err));
	} else {
		Character.create(req.body).then(doc => {
			res.redirect('/characters/' + doc._id);
		}).catch(err => next(err));
	}
};
