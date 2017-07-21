var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = new Schema({
	name: { type: String, required: true, trim: true, index: true, unique: true },
	avatar: { type: Schema.Types.ObjectId, ref: 'Image', default: null },

	intro: { type: String, default: '' },

	count_images: { type: Number, default: 0 },

	// should be a valid url
	homepage: { type: String, required: true, trim: true }
});

module.exports = mongoose.model('Artist', ArtistSchema);