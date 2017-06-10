var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = new Schema({
	name: { type: String, required: true, trim: true, index: true, unique: true },
	avatar: { type: Schema.Types.ObjectId, ref: 'Image', default: null },

	// should be a valid url
	homepage: { type: String, required: true, trim: true }
}, {
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

ArtistSchema.virtual('url_detail').get(function () {
	return '/artists/' + this._id;
});

module.exports = mongoose.model('Artist', ArtistSchema);