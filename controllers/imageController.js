var path = require('path');
var async = require('async');

var sharp = require('sharp');
var Rusha = require('rusha');
var rusha = new Rusha();

var Artist = require('../models/artist');
var Image = require('../models/image');

exports.list = function (req, res, next) {
	var q = Image.find();

	if (req.query.sort != null)
		q = q.sort(req.query.sort);
	else
		q = q.sort('-date');
	
	if (req.query.skip != null)
		q = q.skip(parseInt(req.query.skip));

	if (req.query.limit != null)
		q = q.limit(parseInt(req.query.limit));
	else
		q = q.limit(20);

	if (req.query.populate != null)
		q = q.populate(req.query.populate);
	else 
		q = q.populate('uploader artist');

	q.exec(function (err, docs) {
		if (err) return next(err);

		res.render('image_list', {
			title: 'Images',
			images: docs
		});
	});
};

exports.upload_form = function (req, res, next) {
	if (!req.session.user) return res.redirect('/login');
	Artist.find({}, function (err, docs) {
		if (err) return next(err);

		return res.render('image_upload_form', { title: 'Upload Images', artists: docs });
	})
};

exports.upload = function (req, res, next) {
	if (!req.session.user) return res.redirect('/login');

	if (!req.files || !req.files.files || (!req.files.files.length && !req.files.files.name)) 
		return res.render('image_upload_form', { 
			title: 'Upload Images',
			body: req.body,
			errors: [{ msg: 'No image is uploaded' }] 
		});

	if (!req.files.files.length)
		req.files.files = [ req.files.files ];

	req.checkBody('artist', 'Invalid Artist ID').isMongoId();

	req.sanitize('artist').trim();

	var errors = req.validationErrors();

	if (errors)
		return res.render('image_upload_form', { 
			title: 'Upload Images',
			body: req.body,
			errors: errors
		});

	Artist.findById(req.body.artist, function (err, artist) {
		if (err)
			return res.render('image_upload_form', { 
				title: 'Upload Images',
				body: req.body,
				errors: [ err ] 
			});

		if (!artist)
			return res.render('image_upload_form', { 
				title: 'Upload Images',
				body: req.body,
				errors: [{ msg: 'Artist "' + req.body.artist + '" dose not exist; Make sure to create the artist before uploading his/her image' }] 
			});

		async.concat(req.files.files, function (file, callback) {
			sharp(file.data).metadata(function (err, meta) {
				if (err) return callback(null, err);

				var sha1 = rusha.digestFromBuffer(file.data);

				Image.findOne({ sha1: sha1 }, function (err, image) {
					if (err) return callback(null, err);

					if (image) return callback(null, { msg: 'Image: ' + file.name + ' already exists' });

					file.mv(path.join(appRoot, 'public/static/images', sha1 + '.' + meta.format), function (err) {
						if (err) return callback(null, err);

						new Image({
							artist: req.body.artist,
							uploader: req.session.user._id,

							name_local: sha1 + '.' + meta.format,
							name_original: file.name,
							
							title: req.body.title ? req.body.title : file.name,

							sha1: sha1,

							format: meta.format,
							width: meta.width,
							height: meta.height,
							space: meta.space,
							depth: meta.depth,

							hasAlpha: meta.hasAlpha
						}).save(function (err, doc) {
							if (err) return callback(null, err);

							return callback()
						});
					});
				});
			});
		}, function (err, results) {
			if (err)
				return res.render('image_upload_form', { 
					title: 'Upload Images',
					body: req.body,
					errors: [ err ] 
				});

			return res.render('image_upload_form', { 
				title: 'Upload Images',
				body: req.body,
				warnings: results,
				success: 'Successfully processed ' + req.files.files.length + ' images' 
			});
		});
	});
};

exports.detail = function (req, res, next) {
	Image.findById(req.params.id).populate('artist uploader').exec(function (err, doc) {
		if (err)
			return next(err);

		res.render('image_detail', { title: 'Image: ' + doc._id, image: doc });
	});
};