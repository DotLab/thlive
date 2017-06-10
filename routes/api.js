var express = require('express');
var router = express.Router();

var Image = require('../models/image');
var Character = require('../models/character');

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