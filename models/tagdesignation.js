var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagDesignationSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	target: { type: Schema.Types.ObjectId, required: true },
	date: { type: Date, required: true, default: Date.now },

	tag: { type: Schema.Types.ObjectId, ref: 'Tag', required: true }
});

TagDesignationSchema.index({ user: 1, target: 1 }, { unique: true });

module.exports = mongoose.model('TagDesignation', TagDesignationSchema);