var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true, default: Date.now() },

	title: { type: String, trim: true, required: true },

	sha1: { type: String, required: true, unique: true },

	width: { type: Number, required: true },
	height: { type: Number, required: true },

	format: { type: String, trim: true, required: true },
	space: { type: String, trim: true, required: true },
	depth: { type: String, trim: true, required: true },

	has_alpha: { type: Boolean, required: true }
});

// local name should be of form ${sha1} + '.' + ${format}
ImageSchema.virtual('src').get(function () {
	return '/upload/images/' + this.sha1 + '.' + this.format;
});

module.exports = mongoose.model('Image', ImageSchema);