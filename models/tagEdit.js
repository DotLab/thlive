var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagEditSchema = new Schema({
	for: { type: Schema.Types.ObjectId, ref: 'Tag' },
	type: { type: String, required: true, default: 'create', enum: [ 'create', 'edit', 'rollback' ] },

	editor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true, default: Date.now },
	
	status: { type: String, required: true, default: 'pending', enum: [ 'pending', 'approved', 'rejected' ] },
	date_approved: { type: Date },
	date_rejected: { type: Date },

	vote_approve: { type: Number, required: true, default: 0 },
	vote_reject: { type: Number, required: true, default: 0 },

	body: {
		namespace: { type: String, required: true, enum: [ 'artist', 'character', 'location' ] },

		slaves: { type: [ { type: String, required: true, trim: true, lowercase: true, match: /^[0-9a-z\.\-\+\# \u3040-\u309f\u30a0-\u30ff\u4E00-\u9FFF\uF900-\uFAFF]{1,30}$/ } ], required: true },

		intro: { type: String, required: true, trim: true },
		markdown: { type: String, trim: true }
	}
});

TagEditSchema.virtual('url').get(function () {
	return '/queues/tag/' + this._id;
});

module.exports = mongoose.model('TagEdit', TagEditSchema);