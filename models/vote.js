var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VoteSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true, default: Date.now },

	kind: { type: String, required: true, enum: [ 'Edit', 'Tag', 'Image', 'TagDesignation' ] },
	target_id: { type: Schema.Types.ObjectId, refPath: 'kind' },
	comment: { type: String, trim: true },  // normal votes may not have a comment

	action: { type: String, required: true, enum: [ 'up', 'down', 'close', 'reopen', 'delete', 'undelete', 'approve', 'reject', 'skip' ] },
	is_binding: { type: Boolean, required: true, default: false },
});

VoteSchema.index({ user_id: 1, edit_id: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);