var Card = require('../models/card');

exports.add_form = function (req, res, next) {
	return res.render('card_add_form', { title: 'Add Card', body: req.body, parent: null });	
};

exports.add = function (req, res, next) {
	return res.send(req.body);	
};