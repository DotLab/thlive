var validator = require('validator');

var Tag = require('../models/tag');
var TagEdit = require('../models/tagEdit');

var Review = require('../models/review');

exports.tag = function (req, res, next) {
	var bind = {};

	TagEdit.aggregate()
		.match({ status: 'pending' })
		.lookup({
			from: 'TagEdit',
			localField: '_id',
			foreignField: 'for',
			as: 'reviews'
		})
		.match({ $or: [ 
			{ reviews: { $size: 0 } },
			{ "reviews.reviewer": { $ne: req.session.user._id } }
		] })
		.limit(1)
	.then(docs => {
		if (!docs || !docs.length) throw new Error('Nothing to review');

		bind.edit = docs[0];
		if (docs[0].for)
			return Tag.findById(docs[0].for);
	}).then(doc => {
		res.render('queues/tag', {
			title: 'Tag Queue',
			edit: bind.edit,
			tag: doc
		});
	}).catch(err => next(err));
};