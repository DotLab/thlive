var validator = require('validator');

var Tag = require('../models/tag');
var TagEdit = require('../models/tagEdit');

exports.list = function (req, res, next) {
}

// /users/:id
exports.detail = function (req, res, next) {
}

// /tags/editor?for=<for>
exports.editor = function (req, res, next) {
	res.render('tags/editor', {
		title: 'Tag Editor',
		section: 'tags',
		body: {}
	});
}

exports.editor_post = function (req, res, next) {
	req.checkBody('namespace').notEmpty().isIn([ 'artist', 'character', 'location' ]);
	req.checkBody('intro', 'too long').notEmpty().isLength({ max: 100 });
	req.checkBody('markdown', 'too long').optional({ checkFalsy: true }).isLength({ max: 1000 });

	new TagEdit({
		editor: req.session.user._id,

		edit: req.body
	}).save().then(doc => {
		res.redirect(doc.url);
	}).catch(err => {
		res.render('tags/editor', {
			title: 'Tag Editor',
			section: 'tags',
			body: req.body,
			error: err
		});
	});
};