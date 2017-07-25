var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
	artist: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
	uploader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, default: Date.now() },

	// local name should be of form ${sha1} + '.' + ${format}
	name_local: { type: String, trim: true, required: true },
	name_original: { type: String, trim: true, required: true },

	keywords: [{ type: String, trim: true, lowercase: true }],

	sha1: { type: String, required: true, unique: true },

	format: { type: String, required: true },
	width: { type: Number, required: true },
	height: { type: Number, required: true },
	space: { type: String, required: true },
	depth: { type: String, required: true },

	hasAlpha: { type: Boolean, required: true }
});

ImageSchema.virtual('title').get(function () {
	if (this.keywords)
		return this.keywords.join(' ');
}).set(function (v) {
	this.keywords = v.split(/[\-\－\—\_\ \　\(\)\（\）\.]+/).filter(function (item, pos, self) { 
		return item && self.indexOf(item) == pos; 
	});
});

module.exports = mongoose.model('Image', ImageSchema);