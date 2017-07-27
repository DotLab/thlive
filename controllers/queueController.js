var validator = require('validator');

var Tag = require('../models/tag');
var TagEdit = require('../models/tagedit');

var Review = require('../models/review');

var debug = require('debug')('thlive:queueController');

exports.tag = function (req, res, next) {
	var bind = {};

	TagEdit.aggregate()
		.match({ status: 'pending' })
		.lookup({
			from: 'reviews',
			localField: '_id',
			foreignField: 'for',
			as: 'reviews'
		})
		.match({ $or: [ 
			{ reviews: { $size: 0 } },
			{ "reviews.reviewer": { $ne: req.bindf.user._id } }
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

exports.tag_post = function (req, res, next) {
	req.checkBody('for').isMongoId();
	req.checkQuery('action').isIn([ 'approve', 'reject', 'skip' ]);
	req.checkBody('comment').optional({ checkFalsy: true }).isLength({ max: 100 });

	var bind = {};

	req.getValidationResult().then(result => {
		var err = result.useFirstErrorOnly().array()[0];
		if (err) throw err;
	}).then(() => {
		debug('tag_post', 'add review');
		return new Review({
			for: req.body.for,
			reviewer: req.session.user,
			result: req.query.action,
			binding: req.bindf.user.moderator,
			comment: req.body.comment
		}).save();
	}).then((doc) => {
		debug('tag_post', 'find edit');
		bind.review = doc;
		return TagEdit.findById(req.body.for);
	}).then((doc) => {
		debug('tag_post', 'update edit status');
		bind.edit = doc;
		bind.action = req.query.action;
		bind.complete = bind.review.binding
			|| (bind.action == 'approve' && doc.vote_approve + 1 >= 3) 
			|| (bind.action == 'reject' && doc.vote_reject + 1 >= 3);

		if (bind.action == 'approve') {
			return doc.update(bind.complete ? { 
				status: 'approved',
				date_approved: Date.now(),
				$inc: { vote_approve: 1 } 
			} : { 
				$inc: { vote_approve: 1 } 
			});
		} else if (bind.action == 'reject') {
			return doc.update(bind.complete ? { 
				status: 'rejected',
				date_rejected: Date.now(),
				$inc: { vote_reject: 1 } 
			} : { 
				$inc: { vote_reject: 1 } 
			});
		}
	}).then(status => {
		if (!bind.complete || bind.action == 'reject') return;

		if (bind.edit.type == 'create') {  // create a tag
			debug('tag_post', 'create tag', bind.edit.body);
			return new Tag(bind.edit.body.toObject()).save();
		} else {  // update a tag
			debug('tag_post', 'update tag', bind.edit.for);
			return Tag.findByIdAndUpdate(bind.edit.for, bind.edit.body);
		}
	}).then(doc => {
		debug('tag_post', 'finished');
		res.redirect('tag');
	}).catch(err => next(err));
}