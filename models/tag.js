var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema({
	namespace: { type: String, required: true, enum: [ 'artist', 'character', 'location' ] },

	master: { type: String, required: true, trim: true, lowercase: true, match: /^([0-9a-z\.\-\+\#]+\ )*[0-9a-z\.\-\+\#]+$/ },
	slaves: { type: [ { type: String, trim: true, lowercase: true, match: /^([0-9a-z\.\-\+\#]+\ )*[0-9a-z\.\-\+\#]+$/ } ], unique: true },

	markdown: { type: String, index: 'text', trim: true }
});

module.exports = mongoose.model('Tag', TagSchema);