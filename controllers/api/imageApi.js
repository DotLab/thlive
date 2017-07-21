var path = require('path');

var sharp = require('sharp');

var Rusha = require('rusha');
var rusha = new Rusha();

var Artist = require('../../models/artist');
var Image = require('../../models/image');

exports.keywords = function (req, res, next) {
	var q = Image.find(req.query.query, 'keywords');

	if (req.query.skip)
		q.skip(parseInt(req.query.skip));

	if (req.query.limit)
		q.limit(parseInt(req.query.limit));

	if (req.query.sort)
		q.sort(req.query.sort);

	q.then(docs => {
		var dic = {};
		for (var i = 0; i < docs.length; i++) {
			for (var j = 0; j < docs[i].keywords.length; j++) {
				var word = docs[i].keywords[j].trim();
				if (dic[word] == undefined) {
					dic[word] = 1;
				} else {
					dic[word]++;
				}
			}
		}

		var sortable = [];
		for (var word in dic) {
			sortable.push({ name: word, count: dic[word] });
		}

		sortable.sort(function (a, b) {
			return b.count - a.count;
		});

		res.send(sortable);
	}).catch(err => next(err));
};

exports.siblings = function (req, res, next) {
	Promise.all([
		Image.find({name_original: {$lt: req.query.query.name_original}}).sort('-name_original').limit(1),
		Image.find({name_original: {$gt: req.query.query.name_original}}).sort('name_original').limit(1)
	]).then(docs => {
		res.send([
			docs[0][0],
			docs[1][0]
		]);
	});
};

exports.upload = function (req, res, next) {
	if (!req.files || !req.files.image) {
		return res.send({ failed: true, type: 'warning', title: 'Invalid:', message: 'Nothing is uploaded' });
	}

	req.checkBody('artist', 'Invalid Artist ID').isMongoId();
	req.sanitizeBody('artist').trim();
	var errors = req.validationErrors();
	if (errors) {
		return res.send({ failed: true, type: 'danger', title: 'Invalid:', message: errors[0].message });
	}

	var g = {};

	Artist.findById(req.body.artist).then(doc => {
		if (!doc)
			throw new Error('Nonexistent artist: ' + req.body.artist);

		return sharp(req.files.image.data).metadata();
	}).then(meta => {
		g.meta = meta;
		g.sha1 = rusha.digestFromBuffer(req.files.image.data);

		return Image.findOne({ sha1: g.sha1 });
	}).then(doc => {
		if (doc)
			throw new Error('Duplicated image ' + req.files.image.name + ' &equiv; ' + doc.name_local);

		return new Promise((resolve, reject) => {
			req.files.image.mv(path.join(appRoot, 'public/upload/images', g.sha1 + '.' + g.meta.format), function (err) {
				if (err) reject(err);
				else resolve();
			});
		});
	}).then(() => {
		return Image.create({
			artist: req.body.artist,
			uploader: req.session.user._id,

			name_local: g.sha1 + '.' + g.meta.format,
			name_original: req.files.image.name,
			
			title: req.body.title ? req.body.title : req.files.image.name,

			sha1: g.sha1,

			format: g.meta.format,
			width: g.meta.width,
			height: g.meta.height,
			space: g.meta.space,
			depth: g.meta.depth,

			hasAlpha: g.meta.hasAlpha
		});
	}).then(doc => {
		res.send(doc);
	}).catch(err => {
		res.send({ failed: true, type: 'danger', title: 'Error:', message: err.message });
	});
};