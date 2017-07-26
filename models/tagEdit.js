var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagEditSchema = new Schema({
	for: { type: Schema.Types.ObjectId, ref: 'Tag' },
	type: { type: String, required: true, default: 'initial', enum: [ 'initial', 'edit', 'rollback' ] },

	editor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true, default: Date.now },
	
	status: { type: String, required: true, default: 'pending', enum: [ 'pending', 'approved', 'rejected' ] },
	date_approved: { type: Date },
	date_rejected: { type: Date },

	score: { type: Number, required: true, default: 0 },

	edit: {
		namespace: { type: String, required: true, enum: [ 'artist', 'character', 'location' ] },

		slaves: { type: [ { type: String, required: true, trim: true, lowercase: true, match: /^[0-9a-z\.\-\+\# \u3040-\u309f\u30a0-\u30ff\u4E00-\u9FFF\uF900-\uFAFF]{1,30}$/ } ] },

		intro: { type: String, required: true, trim: true },
		markdown: { type: String, trim: true }
	}
});

module.exports = mongoose.model('TagEdit', TagEditSchema);