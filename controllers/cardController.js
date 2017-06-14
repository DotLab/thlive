var qs = require('qs');
var validator = require('validator');

var Card = require('../models/card');

var User = require('../models/user');
var Image = require('../models/image');
var Character = require('../models/character');
var Comment = require('../models/comment');

var s = {
	limits: {
		N: {
			param_match: { init: [ 1000, 2000 ], max: [ 1500, 3000 ]},
			param_normal: { init: [ 200, 750 ], max: [ 400, 1200 ]}
		},
		R: {
			param_match: { init: [ 2500, 3500 ], max: [ 3500, 4200 ]},
			param_normal: { init: [ 1000, 1600 ], max: [ 1700, 2500 ]}
		},
		SR: {
			param_match: { init: [ 3000, 4000 ], max: [ 4000, 5000 ]},
			param_normal: { init: [ 1400, 3200 ], max: [ 2500, 4400 ]}
		},
		UR: {
			param_match: { init: [ 3000, 4000 ], max: [ 4200, 5400 ]},
			param_normal: { init: [ 2000, 3200 ], max: [ 3000, 4800 ]}
		}
	}
};

var checkBodyParam = function (req, limits, match, attribute) {
	var limit = match ? limits.param_match : limits.param_normal;
	
	req.checkBody(attribute + '_init', attribute + ' init value not in range').isInt({ min: limit.init[0], max: limit.init[1] });
	req.checkBody(attribute + '_max', attribute + ' max value not in range').isInt({ min: limit.max[0], max: limit.max[1] });
};

var checkCardEditorBody = function (req) {
	req.checkBody('base', 'Invalid Base ID').optional({ checkFalsy: true }).isMongoId();

	req.checkBody('character', 'Invalid Character ID').isMongoId();
	req.checkBody('rarity', 'Invalid Rarity').isIn([ 'N', 'R', 'SR', 'SSR' ]);
	req.checkBody('attribute', 'Invalid Attribute').isIn([ 'Haru', 'Rei', 'Ma' ]);

	checkBodyParam(req, s.limits[req.body.rarity], req.body.attribute == 'Haru', 'haru');
	checkBodyParam(req, s.limits[req.body.rarity], req.body.attribute == 'Rei', 'rei');
	checkBodyParam(req, s.limits[req.body.rarity], req.body.attribute == 'Ma', 'ma');

	req.checkBody('sp_init', 'sp init value not in range').isInt({ min: 1, max: 4 });
	req.checkBody('sp_max', 'sp max value not in range').isInt({ min: 1, max: 4 });

	req.checkBody('background', 'Invalid Background Image ID').optional({ checkFalsy: true }).isMongoId();
	req.checkBody('background_x', 'Invalid Background Position X').isInt();
	req.checkBody('background_y', 'Invalid Background Position Y').isInt();
	req.checkBody('background_rotation', 'Invalid Background Rotation').isInt();
	req.checkBody('background_scale', 'Invalid Background Scale').isInt();

	req.checkBody('background_idolized', 'Invalid Idolized Background Image ID').optional({ checkFalsy: true }).isMongoId();
	req.checkBody('background_idolized_x', 'Invalid Idolized Background Position X').isInt();
	req.checkBody('background_idolized_y', 'Invalid Idolized Background Position Y').isInt();
	req.checkBody('background_idolized_rotation', 'Invalid Idolized Background Rotation').isInt();
	req.checkBody('background_idolized_scale', 'Invalid Idolized Background Scale').isInt();

	req.checkBody('portrait', 'Invalid Portrait Image ID').isMongoId();
	req.checkBody('portrait_x', 'Invalid Portrait Position X').isInt();
	req.checkBody('portrait_y', 'Invalid Portrait Position Y').isInt();
	req.checkBody('portrait_rotation', 'Invalid Portrait Rotation').isInt();
	req.checkBody('portrait_scale', 'Invalid Portrait Scale').isInt();

	req.checkBody('portrait_idolized', 'Invalid Idolized Portrait Image ID').isMongoId();
	req.checkBody('portrait_idolized_x', 'Invalid Idolized Portrait Position X').isInt();
	req.checkBody('portrait_idolized_y', 'Invalid Idolized Portrait Position Y').isInt();
	req.checkBody('portrait_idolized_rotation', 'Invalid Idolized Portrait Rotation').isInt();
	req.checkBody('portrait_idolized_scale', 'Invalid Idolized Portrait Scale').isInt();

	req.checkBody('icon_x', 'Invalid Icon Position X').isInt();
	req.checkBody('icon_y', 'Invalid Icon Position Y').isInt();
	req.checkBody('icon_rotation', 'Invalid Icon Rotation').isInt();
	req.checkBody('icon_scale', 'Invalid Icon Scale').isInt();

	req.checkBody('icon_idolized_x', 'Invalid Idolized Icon Position X').isInt();
	req.checkBody('icon_idolized_y', 'Invalid Idolized Icon Position Y').isInt();
	req.checkBody('icon_idolized_rotation', 'Invalid Idolized Icon Rotation').isInt();
	req.checkBody('icon_idolized_scale', 'Invalid Idolized Icon Scale').isInt();
};

exports.list = function (req, res, next) {
	var q = Card.find();
	
	if (req.query.status)
		q = q.find({ status: req.query.status });
	else
		q = q.find({ status: 'Accepted' });

	if (req.query.sort)
		q = q.sort(req.query.sort);
	else
		q = q.sort('-date');

	if (req.query.skip)
		q = q.skip(parseInt(req.query.skip));

	if (req.query.limit)
		q = q.limit(parseInt(req.query.limit));
	else
		q = q.limit(20);

	if (req.query.populate)
		q = q.populate(req.query.populate);
	else 
		q = q.populate('editor character background portrait background_idolized portrait_idolized');

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

		res.render('card/list', { 
			title: 'Cards', 
			cards: docs,
			query: req.query,

			pre: url_pre,
			next: url_next
		});
	});
}

exports.editor_form = function (req, res, next) {
	if (!req.session.user) return res.redirect('/login');

	if (req.query.base && validator.isMongoId(req.query.base)) {
		Card.findById(req.query.base, function (err, doc) {
			if (err) return next(err);

			res.render('card/editor', { title: 'Card Editor - Derive', base: doc._id, body: doc });
		});
	} else {
		res.render('card/editor', { title: 'Card Editor - New' });
	}
};

exports.editor = function (req, res, next) {
	if (!req.session.user) return res.redirect('/login');

	checkCardEditorBody(req);

	var errors = req.validationErrors();

	if (errors)
		return res.render('card/editor', { title: 'Card Editor - Error', errors: errors });

	var ps = [
		Character.findById(req.body.character).exec().then(doc => { 
			if (!doc) throw new Error('Nonexistent Character ID'); 
		}),
		Image.findById(req.body.portrait).exec().then(doc => { 
			if (!doc) throw new Error('Nonexistent Portriat Image ID'); 
		}),
		Image.findById(req.body.portrait_idolized).exec().then(doc => { 
			if (!doc) throw new Error('Nonexistent Idolized Portriat Image ID'); 
		}),
		User.findById(req.session.user._id).exec().then(doc => {
			if (!doc) throw new Error('Nonexistent User ID');

			if (req.query.action == 'create') {
			if (Math.floor(parseInt(doc.reputation) / 10) < doc.count_card)
					throw new Error('You reached your card limit: ' + Math.floor(1 + parseInt(doc.reputation) / 10));
				
				doc.count_card += 1;
				doc.save();
			}
		})
	];

	if (req.query.action == 'overwrite')
		ps.push(Card.findById(req.body.base).exec().then(doc => { 
			if (!doc) throw new Error('Nonexistent Base Card ID'); 
		}));

	if (validator.isMongoId(req.body.background)) {
		ps.push(Image.findById(req.body.background).exec().then(doc => {
			if (!doc) throw new Error('Nonexistent Background Image ID'); 
		}));
	} else {
		req.body.background = null;
	}
	
	if (validator.isMongoId(req.body.background_idolized)) {
		ps.push(Image.findById(req.body.background_idolized).exec().then(doc => { 
			if (!doc) throw new Error('Nonexistent Idolized Background Image ID'); 
		}));
	} else {
		req.body.background_idolized = null;
	}

	Promise.all(ps).then(results => {
		req.body.editor = req.session.user._id;

		if (req.query.action == 'create') {
			return Card.create(req.body);
		} else { // req.query.action == 'overwrite'
			return Card.findByIdAndUpdate(req.body.base, req.body);
		}
	}).then(doc => {
		res.redirect(doc.url_detail);
	}).catch(err => {
		res.render('card/editor', { title: 'Card Editor - Error', error: err });
	});
};

exports.detail = function (req, res, next) {
	var ps = [
		Card.findById(req.params.id).populate('editor character background portrait background_idolized portrait_idolized'),
		Comment.find({ topic: req.params.id }).sort('date').populate('user')
	];

	Promise.all(ps).then(function (results) {
		res.render('card/detail', {
			title: 'Card: ' + results[0].character.name_en + ' ' + results[0].rarity,
			card: results[0],
			comments: results[1]
		});
	}).catch(err => next(err));
};