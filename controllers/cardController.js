var Card = require('../models/card');

exports.add_form = function (req, res, next) {
	return res.render('card/editor', { title: 'Add Card', body: req.body });	
};

exports.add = function (req, res, next) {
	return res.send(req.body);	
};