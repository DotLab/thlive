var debug = require('debug')('thlive:imageApi');

var Image = require('../../models/image');


exports.siblings = function (req, res, next) {
	req.checkQuery('id').isMongoId();

	req.getValidationResult().then(result => {
		result.throw();
	}).then(() => {
		return Promise.all([
			Image.find({ _id: { $lt: req.query.id } }).sort('-_id').limit(1),
			Image.find({ _id: { $gt: req.query.id } }).sort('_id').limit(1)
		]);
	}).then(result => {
		debug(result);
		res.send([
			result[0][0] && result[0][0].toObject({ virtuals: true }),
			result[1][0] && result[1][0].toObject({ virtuals: true })
		]);
	}).catch(err => next(err));
};