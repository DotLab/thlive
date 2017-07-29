var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DesignationSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true, default: Date.now },

	kind: { type: String, required: true, enum: [ 'Image', 'Card', 'Live' ] },
	target_id: { type: Schema.Types.ObjectId, refPath: 'kind' },

	tag_id: { type: Schema.Types.ObjectId, ref: 'Tag', required: true },

	up_votes: { type: Number, required: true, default: 0 },
	down_votes: { type: Number, required: true, default: 0 },
});

DesignationSchema.index({ target_id: 1, tag_id: 1 }, { unique: true });

DesignationSchema.virtual('scores').get(function () {
	return this.up_votes + this.down_votes;
});

module.exports = mongoose.model('Designation', DesignationSchema);