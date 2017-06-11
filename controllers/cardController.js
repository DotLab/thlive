var Card = require('../models/card');

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
	req.checkBody('parent', 'Invalid Character ID').optional({ checkFalsy: true }).isMongoId();
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

exports.add_form = function (req, res, next) {
	return res.render('card/editor', { title: 'Add Card', body: req.body });	
};

exports.add = function (req, res, next) {
	if (!req.session.user) return res.redirect('/login');

	checkCardEditorBody(req);

	var errors = req.validationErrors();

	if (errors)
		return res.render('card/editor', { title: 'Add Card', body: req.body, errors: errors });

	var ps = [
		Character.findById(req.body.character).exec().then(doc => { 
			if (!doc) throw new Error('Nonexistent Character ID'); 
		}),

		Image.findById(req.body.background).exec().then(doc => {
			if (!doc) throw new Error('Nonexistent Background Image ID'); 
		}),
		Image.findById(req.body.portrait).exec().then(doc => { 
			if (!doc) throw new Error('Nonexistent Portriat Image ID'); 
		}),
		Image.findById(req.body.background_idolized).exec().then(doc => { 
			if (!doc) throw new Error('Nonexistent Idolized Background Image ID'); 
		}),
		Image.findById(req.body.portrait_idolized).exec().then(doc => { 
			if (!doc) throw new Error('Nonexistent Idolized Portriat Image ID'); 
		}),
	];

	Promise.all(ps).then(results => {
		req.body.editor = req.session.user._id;

		return Card.create(req.body);
	}).then(doc => {
		res.redirect(doc.url_detail);
	}).catch(err => {
		res.render('card/editor', { title: 'Add Card', body: req.body, error: err });
	});
};