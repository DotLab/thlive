var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.requiredNumber = function (value) {
	return { type: Number, require: true, default: value };
};