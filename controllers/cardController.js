var qs = require('qs');
var validator = require('validator');

var Card = require('../models/card');

var User = require('../models/user');
var Image = require('../models/image');
var Character = require('../models/character');

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
	req.checkBody('character', 'Invalid Character ID').isMongoId();
	req.checkBody('rarity', 'Invalid Rarity').isIn([ 'N', 'R', 'SR', 'SSR' ]);
	req.checkBody('attribute', 'Invalid Attribute').isIn([ 'Haru', 'Rei', 'Ma' ]);

	checkBodyParam(req, s.limits[req.body.rarity], req.body.attribute == 'Haru', 'haru');
	checkBodyParam(req, s.limits[req.body.rarity], req.body.attribute == 'Rei', 'rei');
	checkBodyParam(req, s.limits[req.body.rarity], req.body.attribute == 'Ma', 'ma');

	req.checkBody('sp_init', 'sp init value not in range').isInt({ min: 1, max: 4 });
	req.checkBody('sp_max', 'sp max value not in range').isInt({ min: 1, max: 4 });

	req.checkBody('background', 'Invalid Background Image ID').optional({ checkFalsy: true }).isMongoId();
	req.checkBody('background_x', 'Invalid Background Position X').isFloat();
	req.checkBody('background_y', 'Invalid Background Position Y').isFloat();
	req.checkBody('background_rotation', 'Invalid Background Rotation').isFloat();
	req.checkBody('background_scale', 'Invalid Background Scale').isFloat();

	req.checkBody('background_idolized', 'Invalid Idolized Background Image ID').optional({ checkFalsy: true }).isMongoId();
	req.checkBody('background_idolized_x', 'Invalid Idolized Background Position X').isFloat();
	req.checkBody('background_idolized_y', 'Invalid Idolized Background Position Y').isFloat();
	req.checkBody('background_idolized_rotation', 'Invalid Idolized Background Rotation').isFloat();
	req.checkBody('background_idolized_scale', 'Invalid Idolized Background Scale').isFloat();

	req.checkBody('portrait', 'Invalid Portrait Image ID').isMongoId();
	req.checkBody('portrait_x', 'Invalid Portrait Position X').isFloat();
	req.checkBody('portrait_y', 'Invalid Portrait Position Y').isFloat();
	req.checkBody('portrait_rotation', 'Invalid Portrait Rotation').isFloat();
	req.checkBody('portrait_scale', 'Invalid Portrait Scale').isFloat();

	req.checkBody('portrait_idolized', 'Invalid Idolized Portrait Image ID').isMongoId();
	req.checkBody('portrait_idolized_x', 'Invalid Idolized Portrait Position X').isFloat();
	req.checkBody('portrait_idolized_y', 'Invalid Idolized Portrait Position Y').isFloat();
	req.checkBody('portrait_idolized_rotation', 'Invalid Idolized Portrait Rotation').isFloat();
	req.checkBody('portrait_idolized_scale', 'Invalid Idolized Portrait Scale').isFloat();

	req.checkBody('icon_x', 'Invalid Icon Position X').isFloat();
	req.checkBody('icon_y', 'Invalid Icon Position Y').isFloat();
	req.checkBody('icon_rotation', 'Invalid Icon Rotation').isFloat();
	req.checkBody('icon_scale', 'Invalid Icon Scale').isFloat();

	req.checkBody('icon_idolized_x', 'Invalid Idolized Icon Position X').isFloat();
	req.checkBody('icon_idolized_y', 'Invalid Idolized Icon Position Y').isFloat();
	req.checkBody('icon_idolized_rotation', 'Invalid Idolized Icon Rotation').isFloat();
	req.checkBody('icon_idolized_scale', 'Invalid Idolized Icon Scale').isFloat();
};

exports.editor = function (req, res, next) {
	if (req.query.for) {
		Card.findById(req.query.for).then(doc => {
			res.render('cards/editor', { 
				title: 'Edit Card',
				section: 'cards',

				card: doc
			});
		});
	} else {
		res.render('cards/editor', { 
			title: 'New Card',
			section: 'cards',

			card: {}
		});
	}
};

exports.editor_post = function (req, res, next) {
	checkCardEditorBody(req);

	var errors = req.validationErrors();

	if (errors)
		return res.render('cards/editor', { 
			title: 'Card Rejected', 
			section: 'cards',
			errors: errors, 

			card: req.body
		});

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
		})
	];

	if (req.query.for)
		ps.push(Card.findById(req.query.for).exec().then(doc => { 
			if (!doc) throw new Error('Nonexistent Base Card ID'); 
		}));

	if (validator.isMongoId(req.body.background)) {
		ps.push(Image.findById(req.body.background).exec().then(doc => {
			if (!doc) throw new Error('Nonexistent Background Image ID'); 
		}));
	} else {
		delete req.body.background;
	}
	
	if (validator.isMongoId(req.body.background_idolized)) {
		ps.push(Image.findById(req.body.background_idolized).exec().then(doc => { 
			if (!doc) throw new Error('Nonexistent Idolized Background Image ID'); 
		}));
	} else {
		delete req.body.background_idolized;
	}

	Promise.all(ps).then(() => {
		req.body.editor = req.session.user._id;

		if (req.query.for) {
			return Card.findByIdAndUpdate(req.query.for, req.body);
		} else {
			return Card.create(req.body);
		}
	}).then(doc => {
		res.redirect('/cards/editor?for=' + doc._id);
	}).catch(err => {
		return next(err);
		res.render('cards/editor', { 
			title: 'Card Rejected', 
			section: 'cards',
			error: err, 

			card: req.body
		});
	});
};

exports.detail = function (req, res, next) {
	Card.findById(req.params.id).populate('character portrait background portrait_idolized background_idolized').then(doc => {
		res.render('cards/detail', { 
			title: '', 
			section: 'cards', 

			card: doc
		});
	}).catch(err => next(err));
};