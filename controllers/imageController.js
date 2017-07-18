var Image = require('../models/image');
var Artist = require('../models/artist');


exports.list = function (req, res, next) {
	Image.find().sort('-date').populate('artist').then(docs => {
		res.render('images/list', {
			title: 'Images',
			section: 'images',

			images: docs
		});
	}).catch(err => next(err));
};

exports.detail = function (req, res, next) {
	var image;

	Image.findById(req.params.id).then(doc => {
		image = doc;

		return Artist.findById(doc.artist).populate('avatar');
	}).then(doc => {
		res.render('images/detail', {
			title: doc.name,
			section: 'images',

			artist: doc,
			image: image
		});
	}).catch(err => next(err));
};

exports.upload = function (req, res, next) {
	res.render('images/upload', {
		title: 'Upload Images',
		section: 'images',
	});
};

exports.upload_post = function (req, res, next) {
	res.send(req.body);
};
