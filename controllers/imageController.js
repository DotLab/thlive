var path = require('path');
var qs = require('qs');

var sharp = require('sharp');
var Rusha = require('rusha');
var rusha = new Rusha();

var User = require('../models/user');
var Artist = require('../models/artist');
var Image = require('../models/image');
var Comment = require('../models/comment');

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

		req.query.skip = req.query.skip || 0;
		req.query.limit = req.query.limit || 20;

		var skip = parseInt(req.query.skip);

		req.query.skip = skip - parseInt(req.query.limit);
		var url_pre = qs.stringify(req.query);
		req.query.skip = skip + parseInt(req.query.limit);
		var url_next = qs.stringify(req.query);

		req.query.skip = skip;

		return res.render('image/list', {
			title: 'Images',
			query: req.query,
			images: docs,

			pre: url_pre,
			next: url_next
		});
	});
};

exports.upload_form = function (req, res, next) {
	return res.render('image/upload', { 
		title: 'Upload Images'
	});
};

exports.upload = function (req, res, next) {
	if (!req.session.user) return res.redirect('/login');

	if (!req.files || !req.files.files || (!req.files.files.length && !req.files.files.name)) 
		return res.render('image/upload', { 
			title: 'Upload Images',
			error: { msg: 'No image is uploaded' }
		});

	if (!req.files.files.length)
		req.files.files = [ req.files.files ];

	req.checkBody('artist', 'Invalid Artist ID').isMongoId();

	req.sanitizeBody('artist').trim();

	var errors = req.validationErrors();

	if (errors) {
		return res.render('image/upload', { 
			title: 'Upload Images',
			errors: errors
		});
	}

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
				Image.create({
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
				});
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

		res.render('image/upload', { 
			title: 'Update Images', 
			errors: results, 
			info: req.files.files.length + ' file(s) processed'
		});
	}).catch(err => {
		res.render('image/upload', { 
			title: 'Update Images',
			error: err
		});
	});
};

exports.detail = function (req, res, next) {
	var ps = [
		Image.findById(req.params.id).populate('artist uploader'),
		Comment.find({ topic: req.params.id }).sort('date').populate('user')
	];

	Promise.all(ps).then(function (results) {
		res.render('image/detail', {
			title: 'Image: ' + results[0].title,
			image: results[0],
			comments: results[1]
		});
	}).catch(err => next(err));
};