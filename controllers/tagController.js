var validator = require('validator');

var Tag = require('../models/tag');
var Edit = require('../models/edit');

exports.list = function (req, res, next) {
	Tag.find().then(tags => {
		res.render('tags/list', {
			title: 'Tags',
			tags: tags
		});
	}).catch(err => next(err));
}

// /users/:id
exports.detail = function (req, res, next) {
	Tag.findById(req.params.id).then(tag => {
		res.render('tags/detail', {
			title: tag.master,
			tag: tag
		});
	}).catch(err => next(err));
}

exports.create = function (req, res, next) {
	res.render('tags/create', {
		title: 'Create Tag'
	});
};

exports.create_post = function (req, res, next) {
	req.checkBody('slaves').isArray();
	req.checkBody('namespace').notEmpty().isIn([ 'artist', 'character', 'location' ]);
	req.checkBody('excerpt').notEmpty();

	req.getValidationResult().then(result => {
		var err = result.array()[0];
		if (err) throw err;
	}).then(() => {
		return new Edit({
			user_id: req.bindf.user._id,

			kind: 'Tag',

			content: {
				namespace: req.body.namespace,
				slaves: req.body.slaves,
				excerpt: req.body.excerpt,
				wiki: req.body.wiki
			},

			action: 'create'
		}).save();
	}).then(edit => {
		res.redirect(edit.url);
	}).catch(err => {
		res.render('tags/create', {
			title: 'Create Tag',
			error: err
		});
	});
};

// /tags/
exports.edit = function (req, res, next) {
	Tag.findById(req.params.id).then(tag => {
		res.render('tags/create', { 
			title: 'Edit Tag',
			body: tag
		});
	});
}

exports.edit_post = function (req, res, next) {
	req.checkBody('slaves').isArray();
	req.checkBody('namespace').notEmpty().isIn([ 'artist', 'character', 'location' ]);
	req.checkBody('excerpt').notEmpty();

	req.getValidationResult().then(result => {
		var err = result.array()[0];
		if (err) throw err;
	}).then(() => {
		return Tag.findById(req.params.id);
	}).then((tag) => {
		return new Edit({
			user_id: req.bindf.user._id,

			kind: 'Tag',
			target_id: tag._id,

			content: {
				namespace: req.body.namespace,
				slaves: req.body.slaves,
				excerpt: req.body.excerpt,
				wiki: req.body.wiki
			},

			base_edit_id: tag.edit_id,
			action: 'edit'
		}).save();
	}).then(edit => {
		res.redirect(edit.url);
	}).catch(err => {
		res.render('tags/create', {
			title: 'Edit Tag',
			error: err
		});
	});
};

exports.history = function (req, res, next) {
	Promise.all([
		Tag.findById(req.params.id),
		Edit.find({ target_id: req.params.id }).sort('-date').populate('user_id base_edit_id')
	]).then(result => {
		res.render('review/history', {
			title: 'Revisions to ' + result[0].master,
			back: 'Return to Tag',
			back_url: result[0].url,
			edits: result[1]
		});
	}).catch(err => next(err));
};