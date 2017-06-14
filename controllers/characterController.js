var Character = require('../models/character');
var Comment = require('../models/comment');

exports.list = function (req, res, next) {
	Character.find({}, function (err, docs) {
		if (err) return next(err);

		res.render('character/list', {
			title: 'Characters',
			characters: docs
		});
	});
};

exports.add_form = function (req, res, next) {
	return res.render('character/add', { title: 'Add Character' });
};

exports.add = function (req, res, next) {
	req.checkBody('name_jp', 'Empty character Japanese name').notEmpty();
	req.checkBody('name_zh', 'Empty character Chainese name').notEmpty();
	req.checkBody('name_en', 'Empty character English name').notEmpty();
	req.checkBody('age', 'Empty character age').notEmpty();
	req.checkBody('race', 'Empty character race').notEmpty();
	req.checkBody('skill', 'Empty character skill').notEmpty();

	req.sanitizeBody('name_jp').trim();
	req.sanitizeBody('name_zh').trim();
	req.sanitizeBody('name_en').trim();
	req.sanitizeBody('age').trim();
	req.sanitizeBody('race').trim();
	req.sanitizeBody('skill').trim();

	var errors = req.validationErrors();

	if (errors) {
		return res.render('character/add', { 
			title: 'Add Character', 
			errors: errors
		});
	}

	Character.create({
		name_jp: req.body.name_jp,
		name_zh: req.body.name_zh,
		name_en: req.body.name_en,
		age: req.body.age,
		race: req.body.race,
		skill: req.body.skill,
	}, function (err, doc) {
		if (err) {
			return res.render('character/add', { 
				title: 'Add Character',  
				error: err
			});
		}

		return res.redirect(doc.url_detail);
	});
};

exports.detail = function (req, res, next) {
	var ps = [
		Character.findById(req.params.id),
		Comment.find({ topic: req.params.id }).sort('date').populate('user')
	];

	Promise.all(ps).then(function (results) {
		res.render('character/detail', {
			title: 'Character: ' + results[0].name_jp,
			character: results[0],
			comments: results[1]
		});
	}).catch(err => next(err));
};