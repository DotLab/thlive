var validator = require('validator');

var Image = require('../models/image');

exports.list = function (req, res, next) {
}

// /users/:id
exports.detail = function (req, res, next) {
}

// /images/upload?for=<for>
exports.upload = function (req, res, next) {
	res.render('images/upload', { 
		title: 'Upload Image'
	});
}

exports.upload_post = function (req, res, next) {
	req.checkBody('title').notEmpty();
	req.checkBody('tags').isArray();

	req.getValidationResult().then(result => {
		var err = result.useFirstErrorOnly().array()[0];
		if (err) throw err;
	}).catch(err => {
		res.render('images/upload', {
			title: 'Upload Image',
			error: err
		});
	});
};