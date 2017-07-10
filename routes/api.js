var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Image = require('../models/image');
var Character = require('../models/character');

router.get('/body', function (req, res, next) {
	res.send(req.body);
});

router.get('/query', function (req, res, next) {
	res.send(req.query);
});

router.get('/users', function (req, res, next) {
	var q = User.find(req.query.query);

	if (req.query.sort)
		q.sort(req.query.sort);

	if (req.query.populate)
		q.populate(req.query.populate);

	q.then(docs => res.send(docs)).catch(err => next(err));
});

router.get('/images/:id', function (req, res, next) {
	Image.findById(req.params.id).then(function (doc) {
		doc.success = true;
		return res.send(doc);
	}).catch(function (err) {
		err.success = false;
		return res.send(err);
	});
});

router.get('/characters/:id', function (req, res, next) {
	Character.findById(req.params.id).then(function (doc) {
		doc.success = true;
		return res.send(doc);
	}).catch(function (err) {
		err.success = false;
		return res.send(err);
	});
});

module.exports = router;