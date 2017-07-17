var express = require('express');
var router = express.Router();

var Artist = require('../models/artist');
var Image = require('../models/image');

var genericApi = function (model) {
	return function (req, res, next) {
		var q = model.find(req.query.query);

		if (req.query.skip)
			q.skip(parseInt(req.query.skip));

		if (req.query.limit)
			q.limit(parseInt(req.query.limit));

		if (req.query.sort)
			q.sort(req.query.sort);

		if (req.query.populate)
			q.populate(req.query.populate);

		q.then(docs => {
			res.send(docs)
		}).catch(err => next(err));
	};
};

router.get('/artists', genericApi(Artist));

router.get('/artists/list', function (req, res, next) {
	var q = Artist.find().populate('avatar');

	if (req.query.skip)
		q.skip(parseInt(req.query.skip));

	if (req.query.limit)
		q.limit(parseInt(req.query.limit));

	if (req.query.sort)
		q.sort(req.query.sort);

	var artists;

	q.then(docs => {
		artists = docs;

		var qs = [];
		for (var i = 0; i < docs.length; i++) {
			qs.push(Image.find({ artist: docs[i]._id }).sort('-date').limit(4));
		}
		return Promise.all(qs);
	}).then(docs => {
		var r = [];

		for (var i = 0; i < artists.length; i++) {
			r.push({
				id: artists[i]._id,
				name: artists[i].name,
				intro: artists[i].intro,
				homepage: artists[i].homepage,
				count_images: artists[i].count_images,
				href: '/artists/' + artists[i]._id,
				avatar_src: artists[i].avatar ? '/upload/images/' + artists[i].avatar.name_local : '/img/64.svg',

				hero_0_href: '/images/' + docs[i][0]._id,
				hero_0_src: '/upload/images/' + docs[i][0].name_local,

				hero_1_href: '/images/' + docs[i][1]._id,
				hero_1_src: '/upload/images/' + docs[i][1].name_local,
				
				hero_2_href: '/images/' + docs[i][2]._id,
				hero_2_src: '/upload/images/' + docs[i][2].name_local,
				
				hero_3_href: docs[i][3] ? '/images/' + docs[i][3]._id : '',
				hero_3_src: docs[i][3] ? '/upload/images/' + docs[i][3].name_local : '',
			});
		}

		res.send(r);
	}).catch(err => next(err));
});

router.get('/images', genericApi(Image));

router.get('/images/keywords', function (req, res, next) {
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
});



module.exports = router;
