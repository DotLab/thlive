var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagDesignationSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true, default: Date.now },

	kind: { type: String, required: true, enum: [ 'Edit', 'Tag', 'Image', 'TagDesignation' ] },
	target_id: { type: Schema.Types.ObjectId, refPath: 'kind' },

	tag_id: { type: Schema.Types.ObjectId, ref: 'Tag', required: true },

	up_votes: { type: Number, required: true, default: 0 },
	down_votes: { type: Number, required: true, default: 0 },
});

TagDesignationSchema.index({ user: 1, target: 1 }, { unique: true });

TagDesignationSchema.virtual('scores').get(function () {
	return this.up_votes + this.down_votes;
});

module.exports = mongoose.model('TagDesignation', TagDesignationSchema);