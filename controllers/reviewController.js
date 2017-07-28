var validator = require('validator');

var Tag = require('../models/tag');
var Edit = require('../models/edit');

var Vote = require('../models/vote');

var debug = require('debug')('thlive:queueController');

exports.list = function (req, res, next) {
	Promise.all([
		Edit.aggregate([
			{ $match: { status: 'pending' } },
			{ $lookup: { from: 'votes', localField: '_id', foreignField: 'target_id', as: 'votes' } },
			{ $match: { $or: [ 
				{ votes: { $size: 0 } },
				{ "votes.user_id": { $ne: req.bindf.user._id } }
			] } },
			{ $count: 'count' }
		])
	]).then(result => {
		debug('list', result);
		res.render('review/list', {
			title: 'Review',
			tag: (result[0][0] && result[0][0].count) || 0
		});
	}).catch(err => next(err));
}

exports.tag_readonly = function (req, res, next) {
	Promise.all([
		Edit.findById(req.params.id).populate('user_id base_edit_id'),
		Vote.find({ target_id: req.params.id, action: { $in: [ 'approve', 'reject' ] } }).populate('user_id')
	]).then(result => {
		res.render('review/tag', {
			title: 'Tag Edit Review',
			readonly: true,

			edit: result[0],
			base_edit: result[0].base_edit_id || { content: {} },

			votes: result[1]
		});
	}).catch(err => next(err));
}

exports.tag = function (req, res, next) {
	Edit.aggregate([
		{ $match: { status: 'pending' } },
		{ $lookup: { from: 'votes', localField: '_id', foreignField: 'target_id', as: 'votes' } },
		{ $match: { $or: [ 
			{ votes: { $size: 0 } },
			{ "votes.user_id": { $ne: req.bindf.user._id } }
		] } },
		{ $limit: 1 }
	]).then(tags => {
		if (!tags || !tags.length) throw new Error('Nothing to review');

		debug('tag', tags[0]);
		return Edit.populate(tags[0], { path: 'base_edit_id' });
	}).then(tag => {
		res.render('review/tag', {
			title: 'Tag Queue',
		
			edit: tag,
			base_edit: tag.base_edit_id || { content: {} },
		});
	}).catch(err => next(err));
};

exports.tag_post = function (req, res, next) {
	req.checkBody('target_id').isMongoId();
	req.checkQuery('action').isIn([ 'approve', 'reject', 'skip' ]);

	req.getValidationResult().then(result => {
		var err = result.useFirstErrorOnly().array()[0];
		if (err) throw err;
	}).then(() => {
		return Edit.findById(req.body.target_id);
	}).then((edit) => {
		if (!edit) throw new Error('Nonexisting edit');

		debug('tag_post', 'add vote');

		var ps = [];

		ps.push(new Vote({
			user_id: req.bindf.user._id,
			kind: 'Edit',
			target_id: req.body.target_id,
			action: req.query.action,

			is_binding: req.bindf.user.is_mod,
			comment: req.body.comment
		}).save());

		var action = req.query.action;
		var isComplete = req.bindf.user.is_mod
			|| (action == 'approve' && edit.approve_votes + 1 >= 3) 
			|| (action == 'reject' && edit.reject_votes + 1 >= 3);

		debug('tag_post', 'vote action:', action);
		debug('tag_post', 'is complete:', isComplete);

		debug('tag_post', 'update edit status');
		if (action == 'approve') {
			ps.push(edit.update(isComplete ? { 
				status: 'approved',
				approved_date: Date.now(),
				$inc: { approve_votes: 1 } 
			} : {
				$inc: { approve_votes: 1 } 
			}));
		} else if (action == 'reject') {
			ps.push(edit.update(isComplete ? { 
				status: 'rejected',
				rejected_date: Date.now(),
				$inc: { reject_votes: 1 } 
			} : {
				$inc: { reject_votes: 1 } 
			}));
		}

		if (isComplete) {
			var tag = edit.content;
			tag.edit_id = edit._id;

			if (edit.action == 'create') {  // create a tag
				debug('tag_post', 'create tag', tag);
				ps.push(new Tag(tag).save().then(tag => edit.update({ target_id: tag._id })));
			} else {  // edit or rollback
				debug('tag_post', 'update tag', tag);
				ps.push(Tag.findByIdAndUpdate(edit.target_id, tag));
			}
		}

		return Promise.all(ps);
	}).then(result => {
		debug('tag_post', 'finished', result);
		res.redirect('tag');
	}).catch(err => next(err));
}