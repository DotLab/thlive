var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EditSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true, default: Date.now },

	kind: { type: String, required: true, enum: [ 'Tag', 'Image' ] },
	// non accepted create action do not have a target
	target_id: { type: Schema.Types.ObjectId, refPath: 'kind' },

	// if an edit is approved, the content will be applied to the target while setting the target's edit to this
	// need to doc.markModified('content') before doc.save()
	content: { type: Object, required: true },
	
	// original edit of the target
	base_edit_id: { type: Schema.Types.ObjectId, ref: 'Edit' },

	comment: { type: String, trim: true },

	action: { type: String, required: true, enum: [ 'create', 'edit', 'rollback' ] },
	status: { type: String, required: true, default: 'pending', enum: [ 'pending', 'approved', 'rejected' ] },
	
	approved_date: { type: Date },
	rejected_date: { type: Date },

	approve_votes: { type: Number, required: true, default: 0 },
	reject_votes: { type: Number, required: true, default: 0 },
});

EditSchema.virtual('url').get(function () {
	return '/review/' + this.kind.toLowerCase() + '/' + this._id;
});

module.exports = mongoose.model('Edit', EditSchema);