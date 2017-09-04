var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var regexpHelper = require('../helpers/regexpHelper');

var TagSchema = new Schema({
	edit_id: { type: Schema.Types.ObjectId, ref: 'Edit', required: true },

	namespace: { type: String, required: true, enum: [ 'artist', 'character', 'location' ], index: true },

	slaves: { type: [ { type: String, required: true, trim: true, match: regexpHelper.model.tag.slaves } ], index: true },

	excerpt: { type: String, required: true, trim: true },
	wiki: { type: String, trim: true },

	up_votes: { type: Number, required: true, default: 0 },
	down_votes: { type: Number, required: true, default: 0 },
});

TagSchema.index({ namespace: 1, slaves: 1 }, { unique: true });

TagSchema.virtual('master').get(function () {
	return this.namespace + ':' + this.slaves[0];
});

TagSchema.virtual('url').get(function () {
	return '/tags/' + this._id;
});

TagSchema.virtual('scores').get(function () {
	return this.up_votes + this.down_votes;
});

module.exports = mongoose.model('Tag', TagSchema);