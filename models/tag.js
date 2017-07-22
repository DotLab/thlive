var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	avatar: { type: Schema.Types.ObjectId, ref: 'Tag', default: null, required: true },

	name: { type: String, required: true, trim: true, index: true, unique: true },

	alias: [ { type: String, trim: true } ],

	markdown: { type: String, trim: true }
});

module.exports = mongoose.model('Tag', TagSchema);