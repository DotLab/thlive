var Comment = require('../models/comment');

exports.add = function (req, res, next) {
	if (!req.session.user._id)
		return res.redirect('back');

	req.checkBody('topic', 'Invalide Topic ID').isMongoId();
	req.checkBody('markdown', 'Empty markdown').notEmpty();

	req.sanitizeBody('markdown').trim();

	var errors = req.validationErrors();

	if (errors)
		return next(errors[0]);

	Comment.create({
		user: req.session.user._id,

		topic: req.body.topic,
		markdown: req.body.markdown
	}, function (err, doc) {
		if (err)
			return next(err)

		res.redirect('back');
	});
};
