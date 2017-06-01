var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = new Schema({
	name: { type: String, required: true },

	avatar: { type: Schema.Types.ObjectId, ref: 'Image' },

	homepage: { type: String, required: true }
});

module.exports = mongoose.model('Artist', ArtistSchema);