var validator = require('validator');

var Tag = require('../models/tag');
var TagEdit = require('../models/tagedit');

exports.list = function (req, res, next) {
}

// /users/:id
exports.detail = function (req, res, next) {
}

// /tags/editor?for=<for>
exports.editor = function (req, res, next) {
	res.render('tags/editor', {
		title: 'Tag Editor'
	});
}

exports.editor_post = function (req, res, next) {
	req.checkQuery('for').optional({ checkFalsy: true }).isMongoId();
	req.checkBody('namespace').notEmpty().isIn([ 'artist', 'character', 'location' ]);
	req.checkBody('intro', 'empty or too long').notEmpty().isLength({ max: 100 });
	req.checkBody('markdown', 'empty or too long').optional({ checkFalsy: true }).isLength({ max: 1000 });

	req.getValidationResult().then(result => {
		var err = result.array()[0];
		if (err) throw err;
	}).then(() => {
		return new TagEdit({
			for: req.query.for || undefined,
			editor: req.session.user._id,

			body: req.body
		}).save();
	}).then(doc => {
		res.redirect(doc.url);
	}).catch(err => {
		res.render('tags/editor', {
			title: 'Tag Editor',
			error: err
		});
	});
};