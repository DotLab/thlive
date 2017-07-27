var validator = require('validator');

var Image = require('../models/image');

exports.list = function (req, res, next) {
}

// /users/:id
exports.detail = function (req, res, next) {
}

// /tags/editor?for=<for>
exports.editor = function (req, res, next) {
	if (req.query.for) {
		Image.findById(req.query.for).then(doc => {
			res.render('tags/editor', { 
				title: 'Edit Image',
				body: doc
			});
		});
	} else {
		res.render('tags/editor', { 
			title: 'New Image'
		});
	}
}

exports.editor_post = function (req, res, next) {
};