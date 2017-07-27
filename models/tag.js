var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	edit: { type: Schema.Types.ObjectId, ref: 'TagEdit' },

	namespace: { type: String, required: true, enum: [ 'artist', 'character', 'location' ] },

	slaves: { type: [ { type: String, required: true, trim: true, lowercase: true, match: /^[0-9a-z\.\-\+\# \u3040-\u309f\u30a0-\u30ff\u4E00-\u9FFF\uF900-\uFAFF]{1,30}$/ } ], unique: true },

	intro: { type: String, required: true, trim: true },
	markdown: { type: String, trim: true }
});

TagSchema.virtual('master').get(function () {
	return this.slaves[0];
});

TagSchema.virtual('url').get(function () {
	return '/tags/' + this._id;
});

module.exports = mongoose.model('Tag', TagSchema);