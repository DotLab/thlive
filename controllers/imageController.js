var path = require('path');

var sharp = require('sharp');

var Rusha = require('rusha');
var rusha = new Rusha();

var debug = require('debug')('thlive:imageController')

var validator = require('validator');

var Image = require('../models/image');
var Tag = require('../models/tag');
var Designation = require('../models/designation');

exports.list = function (req, res, next) {
	if (!req.query.tags)
		Image.find().then(images => {
			res.render('images/list', {
				title: 'Images',
				images: images
			});
		}).catch(err => next(err));
}

// /users/:id
exports.detail = function (req, res, next) {
	Promise.all([
		Image.findById(req.params.id).populate('user_id'),
		Designation.find({ target_id: req.params.id }).populate('tag_id')
	]).then(result => {
		res.render('images/detail', {
			title: result[0].title,
			image: result[0],
			designations: result[1]
		});
	}).catch(err => next(err));
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

	var closure = {};

	req.getValidationResult().then(result => {
		if (!req.files || !req.files.image) throw new Error('Nothing is uploaded');

		var err = result.useFirstErrorOnly().array()[0];
		if (err) throw err;

		closure.sha1 = rusha.digestFromBuffer(req.files.image.data);
	}).then(() => {
		closure.sharp = sharp(req.files.image.data);

		return Promise.all([
			Promise.all(req.body.tags.map(e => Tag.findById(e))),
			Image.findOne({ sha1: closure.sha1 }),
			closure.sharp.metadata(),
			closure.sharp.resize(128, 128)
				.crop(sharp.strategy.entropy)
				.jpeg({ quality: 70, progressive: true })
				.toFile(path.join(appRoot, 'public/upload/images', closure.sha1 + '-thumb.jpg')),
			closure.sharp.resize(undefined, 600)
				.jpeg({ quality: 80, progressive: true, optimizeScans: true })
				.toFile(path.join(appRoot, 'public/upload/images', closure.sha1 + '-preview.jpg')),
		]);
		return ;
	}).then(result => {
		debug(result);
		if (!result[0] || !result[0].length || !result[0].every(e => e))
			throw new Error('Invalid tags');

		if (result[1])
			throw new Error('Duplicated image ' + req.files.image.name + ' => ' + result[1].sha1);

		var meta = result[2];
		if (meta.width < 512 && meta.height < 512)
			throw new Error('Image too small');

		return Promise.all([
			new Promise((resolve, reject) => {
				req.files.image.mv(path.join(appRoot, 'public/upload/images', closure.sha1 + '.' + meta.format), function (err) {
					if (err) reject(err);
					else resolve();
				});
			}),
			Image.create({
				user_id: req.bindf.user._id,
		
				title: req.body.title,

				sha1: closure.sha1,

				width: meta.width,
				height: meta.height,

				format: meta.format,
				space: meta.space,
				depth: meta.depth,

				has_alpha: meta.hasAlpha
			}).then(image => {
				closure.image = image;

				return Designation.create(result[0].map(e => {
					return {
						user_id: req.bindf.user._id,
						kind: 'Image',
						target_id: image._id,
						tag_id: e._id
					}
				}));
			})
		]);
	}).then(result => {
		res.redirect(closure.image.url);
	}).catch(err => {
		res.render('images/upload', {
			title: 'Upload Image',
			error: err
		});
	});
};