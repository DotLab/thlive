var Artist = require('../models/artist');


exports.list = function (req, res, next) {
	Artist.find().then(docs => {
		res.render('artists/list', {
			title: 'Artists',
			section: 'artists',

			artists: docs
		});
	}).catch(err => next(err));
};

exports.detail = function (req, res, next) {
	
};