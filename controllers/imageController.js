var path = require('path');
var async = require('async');
var qs = require('qs');

var sharp = require('sharp');
var Rusha = require('rusha');
var rusha = new Rusha();

var User = require('../models/user');
var Artist = require('../models/artist');
var Image = require('../models/image');

exports.list = function (req, res, next) {
	var q = Image.find();

	if (req.query.keywords)
		q = q.find({ keywords: { $all: req.query.keywords.split(' ') } });

	if (req.query.artist)
		q = q.find({ artist: req.query.artist });

	if (req.query.sort)
		q = q.sort(req.query.sort);
	else
		q = q.sort('name_original');
	
	if (req.query.skip)
		q = q.skip(parseInt(req.query.skip));

	if (req.query.limit)
		q = q.limit(parseInt(req.query.limit));
	else
		q = q.limit(20);

	if (req.query.populate)
		q = q.populate(req.query.populate);
	else 
		q = q.populate('uploader artist');

	q.exec(function (err, docs) {
		if (err) return next(err);

		if (!req.query.skip)
			req.query.skip = 0;

		if (!req.query.limit)
			req.query.limit = 20;

		var skip = parseInt(req.query.skip);

		req.query.skip = skip - parseInt(req.query.limit);
		var p = qs.stringify(req.query);
		req.query.skip = skip + parseInt(req.query.limit);
		var n = qs.stringify(req.query);

		req.query.skip = skip;

		return res.render('image/list', {
			title: 'Images',
			query: req.query,
			images: docs,

			pre: p,
			next: n
		});
	});
};

exports.upload_form = function (req, res, next) {
	return res.render('image/upload', { title: 'Upload Images', body: {} });
};

exports.upload = function (req, res, next) {
	if (!req.session.user) return res.redirect('/login');

	if (!req.files || !req.files.files || (!req.files.files.length && !req.files.files.name)) 
		return res.render('image/upload', { 
			title: 'Upload Images',
			body: req.body,
			error: { msg: 'No image is uploaded' } 
		});

	if (!req.files.files.length)
		req.files.files = [ req.files.files ];

	req.checkBody('artist', 'Invalid Artist ID').isMongoId();

	req.sanitize('artist').trim();

	var errors = req.validationErrors();

	if (errors)
		return res.render('image/upload', { 
			title: 'Upload Images',
			body: req.body,
			errors: errors
		});

	Artist.findById(req.body.artist).exec().then(artist => {
		if (!artist) throw new Error('Nonexistent artist: ' + req.body.artist);

		var ps = [];

		for (var i = 0; i < req.files.files.length; i++) {
			var file = req.files.files[i];

			var bind = {};

			var p = sharp(file.data).metadata().then(meta => {
				bind.meta = meta;

				var sha1 = rusha.digestFromBuffer(file.data);
				bind.sha1 = sha1;

				return Image.findOne({ sha1: sha1 });
			}).then(image => {
				if (image) throw new Error('Duplicated image: ' + file.name);

				return new Promise((resolve, reject) => {
					file.mv(path.join(appRoot, 'public/res/img', bind.sha1 + '.' + bind.meta.format), err => {
						if (err) reject(err);
						else resolve();
					});
				});
			}).then(() => {
				return new Image({
					artist: req.body.artist,
					uploader: req.session.user._id,

					name_local: bind.sha1 + '.' + bind.meta.format,
					name_original: file.name,
					
					title: req.body.title ? req.body.title : file.name,

					sha1: bind.sha1,

					format: bind.meta.format,
					width: bind.meta.width,
					height: bind.meta.height,
					space: bind.meta.space,
					depth: bind.meta.depth,

					hasAlpha: bind.meta.hasAlpha
				}).save();
			}).then(image => {
				return null;
			}).catch(err => {
				return err;
			});

			ps.push(p);
		}

		return Promise.all(ps);
	}).then(results => {
		results = results.filter(v => (v != null));
		if (results.length == 0)
			User.findByIdAndUpdate(req.session.user._id, { $inc: { reputation: 1 } }).exec();

		res.render('image/upload', { title: 'Update Images', body: req.body, errors: results, info: req.files.files.length + ' file(s) processed' });
	}).catch(err => {
		res.render('image/upload', { title: 'Update Images', body: req.body, error: err });
	});

	// Artist.findById(req.body.artist, function (err, artist) {
	// 	if (err)
	// 		return res.render('image/upload', { 
	// 			title: 'Upload Images',
	// 			body: req.body,
	// 			errors: [ err ] 
	// 		});

	// 	if (!artist)
	// 		return res.render('image/upload', { 
	// 			title: 'Upload Images',
	// 			body: req.body,
	// 			errors: [{ msg: 'Artist "' + req.body.artist + '" dose not exist; Make sure to create the artist before uploading his/her image' }] 
	// 		});

	// 	async.concat(req.files.files, function (file, callback) {
	// 		sharp(file.data).metadata(function (err, meta) {
	// 			if (err) return callback(null, err);

	// 			var sha1 = rusha.digestFromBuffer(file.data);

	// 			Image.findOne({ sha1: sha1 }, function (err, image) {
	// 				if (err) return callback(null, err);

	// 				if (image) return callback(null, { msg: 'Image: ' + file.name + ' already exists' });

	// 				file.mv(path.join(appRoot, 'public/res/img', sha1 + '.' + meta.format), function (err) {
	// 					if (err) return callback(null, err);

	// 					new Image({
	// 						artist: req.body.artist,
	// 						uploader: req.session.user._id,

	// 						name_local: sha1 + '.' + meta.format,
	// 						name_original: file.name,
							
	// 						title: req.body.title ? req.body.title : file.name,

	// 						sha1: sha1,

	// 						format: meta.format,
	// 						width: meta.width,
	// 						height: meta.height,
	// 						space: meta.space,
	// 						depth: meta.depth,

	// 						hasAlpha: meta.hasAlpha
	// 					}).save(function (err, doc) {
	// 						if (err) return callback(null, err);

	// 						return callback()
	// 					});
	// 				});
	// 			});
	// 		});
	// 	}, function (err, results) {
	// 		if (err)
	// 			return res.render('image/upload', { 
	// 				title: 'Upload Images',
	// 				body: req.body,
	// 				errors: [ err ] 
	// 			});

	// 		if (!results || !results.length)
	// 			User.findByIdAndUpdate(req.session.user._id, { $inc: { reputation: 1 } }).exec();

	// 		return res.render('image/upload', { 
	// 			title: 'Upload Images',
	// 			body: req.body,
	// 			warnings: results,
	// 			success: 'Successfully processed ' + req.files.files.length + ' images' 
	// 		});
	// 	});
	// });
};

exports.detail = function (req, res, next) {
	Image.findById(req.params.id).populate('artist uploader').exec(function (err, doc) {
		if (err)
			return next(err);

		res.render('image/detail', { title: 'Image: ' + doc._id, image: doc });
	});
};