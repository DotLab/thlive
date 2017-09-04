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

	has_alpha: { type: Boolean, required: true },

	tag_ids: [ { type: Schema.Types.ObjectId, ref: 'Tag' } ],

	up_votes: { type: Number, required: true, default: 0 },
	down_votes: { type: Number, required: true, default: 0 },
});

// local name should be of form ${sha1} + '.' + ${format}
ImageSchema.virtual('src').get(function () {
	return '/upload/images/' + this.sha1 + '.' + this.format;
});

ImageSchema.virtual('thumb').get(function () {
	return '/upload/images/' + this.sha1 + '-thumb.jpg';
});

ImageSchema.virtual('preview').get(function () {
	return '/upload/images/' + this.sha1 + '-preview.jpg';
});

ImageSchema.virtual('url').get(function () {
	return '/images/' + this._id;
});

ImageSchema.virtual('scores').get(function () {
	return this.up_votes + this.down_votes;
});

module.exports = mongoose.model('Image', ImageSchema);