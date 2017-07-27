var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
	uploader: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, default: Date.now() },

	// local name should be of form ${sha1} + '.' + ${format}
	title: { type: String, trim: true, required: true },
	name: { type: String, trim: true, required: true },

	sha1: { type: String, required: true, unique: true },

	format: { type: String, required: true },
	width: { type: Number, required: true },
	height: { type: Number, required: true },
	space: { type: String, required: true },
	depth: { type: String, required: true },

	alpha: { type: Boolean, required: true }
});

ImageSchema.virtual('src').get(function () {
	return '/upload/images/' + this.name;
});

module.exports = mongoose.model('Image', ImageSchema);