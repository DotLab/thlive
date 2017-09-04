var Artist = require('../../models/artist');
var Image = require('../../models/image');

exports.list = function (req, res, next) {
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

				hero_0_href: docs[i][0] ? '/images/' + docs[i][0]._id : '',
				hero_0_src: docs[i][0] ? '/upload/images/' + docs[i][0].name_local : '',

				hero_1_href: docs[i][1] ? '/images/' + docs[i][1]._id : '',
				hero_1_src: docs[i][1] ? '/upload/images/' + docs[i][1].name_local : '',
				
				hero_2_href: docs[i][2] ? '/images/' + docs[i][2]._id : '',
				hero_2_src: docs[i][2] ? '/upload/images/' + docs[i][2].name_local : '',
				
				hero_3_href: docs[i][3] ? '/images/' + docs[i][3]._id : '',
				hero_3_src: docs[i][3] ? '/upload/images/' + docs[i][3].name_local : '',
			});
		}

		res.send(r);
	}).catch(err => next(err));
};
