var validator = require('validator');

var Tag = require('../models/tag');
var TagEdit = require('../models/tagedit');

exports.list = function (req, res, next) {
	Tag.find().then(docs => {
		res.render('tags/list', {
			title: 'Tags',
			tags: docs
		});
	}).catch(err => next(err));
}

// /users/:id
exports.detail = function (req, res, next) {
	Tag.findById(req.params.id).then(doc => {
		res.render('tags/detail', {
			title: doc.slaves[0],
			tag: doc
		});
	}).catch(err => next(err));
}

// /tags/editor?for=<for>
exports.editor = function (req, res, next) {
	if (req.query.for) {
		Tag.findById(req.query.for).then(doc => {
			res.render('tags/editor', { 
				title: 'Edit Tag',
				body: doc
			});
		});
	} else {
		res.render('tags/editor', { 
			title: 'New Tag'
		});
	}
}

exports.editor_post = function (req, res, next) {
	req.checkQuery('for').optional({ checkFalsy: true }).isMongoId();
	req.checkBody('namespace').notEmpty().isIn([ 'artist', 'character', 'location' ]);
	req.checkBody('intro').notEmpty();

	req.getValidationResult().then(result => {
		var err = result.array()[0];
		if (err) throw err;
	}).then(() => {
		if (req.query.for)
			return Tag.findById(req.query.for);
	}).then(doc => {
		return new TagEdit({
			for: doc ? doc._id : undefined,
			type: doc ? 'edit' : 'create',
			editor: req.bindf.user._id,

			base: doc ? doc.edit : undefined,
			body: req.body
		}).save();
	}).then(doc => {
		res.redirect(doc.url);
	}).catch(err => {
		res.render('tags/editor', {
			title: 'Edit Tag',
			error: err
		});
	});
};