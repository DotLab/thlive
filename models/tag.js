var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	edit_id: { type: Schema.Types.ObjectId, ref: 'Edit', required: true },

	namespace: { type: String, required: true, enum: [ 'artist', 'character', 'location' ] },

	slaves: { type: [ { type: String, required: true, trim: true, match: /^[0-9a-z\.\-\+\# \u3040-\u309f\u30a0-\u30ff\u4E00-\u9FFF\uF900-\uFAFF]{1,30}$/ } ], unique: true },

	excerpt: { type: String, required: true, trim: true },
	wiki: { type: String, trim: true },

	up_votes: { type: Number, required: true, default: 0 },
	down_votes: { type: Number, required: true, default: 0 },
});

TagSchema.virtual('master').get(function () {
	return this.slaves[0];
});

TagSchema.virtual('url').get(function () {
	return '/tags/' + this._id;
});

TagSchema.virtual('scores').get(function () {
	return this.up_votes + this.down_votes;
});

module.exports = mongoose.model('Tag', TagSchema);