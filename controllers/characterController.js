var Character = require('../models/character');

exports.list = function (req, res, next) {
	var q = Character.find();

	if (req.query.sort != null)
		q = q.sort(req.query.sort);
	else
		q = q.sort('name_en');
	
	if (req.query.skip != null)
		q = q.skip(parseInt(req.query.skip));

	if (req.query.limit != null)
		q = q.limit(parseInt(req.query.limit));
	else
		q = q.limit(20);

	q.exec(function (err, docs) {
		if (err) return next(err);

		res.render('character/list', {
			title: 'Characters',
			characters: docs,
			user: req.session.user
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

	req.sanitize('name_jp').trim();
	req.sanitize('name_zh').trim();
	req.sanitize('name_en').trim();
	req.sanitize('age').trim();
	req.sanitize('race').trim();
	req.sanitize('skill').trim();

	var errors = req.validationErrors();

	if (errors)
		return res.render('character/add', { title: 'Add Character', body: req.body, errors: errors });

	new Character({
		name_jp: req.body.name_jp,
		name_zh: req.body.name_zh,
		name_en: req.body.name_en,
		age: req.body.age,
		race: req.body.race,
		skill: req.body.skill,
	}).save(function (err, doc) {
		if (err)
			return res.render('character/add', { title: 'Add Character', body: req.body, error: err });

		return res.redirect(doc.url_detail);
	});
};

exports.detail = function (req, res, next) {
	Character.findById(req.params.id, function (err, doc) {
		if (err) return next(err);

		return res.render('character/detail', { title: 'Character: ' + doc.name_jp, character: doc });
	});
};