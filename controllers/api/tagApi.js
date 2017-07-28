var debug = require('debug')('thlive:tagApi');

var Tag = require('../../models/tag');

exports.fuzzy = function (req, res, next) {
	req.checkQuery('slaves').isString().isLength({ min: 2 });
	req.sanitize('slaves').escapeRegexp();

	req.getValidationResult().then(result => {
		result.throw();
	}).then(() => {
		return Tag.find({
			slaves: new RegExp('^.*' + req.query.slaves + '.*$', 'i')
		});	
	}).then(tags => {
		tags = tags.map(e => e.toObject({ virtuals: true }));
		debug(tags);
		return res.send(tags);
	}).catch(err => next(err));
};