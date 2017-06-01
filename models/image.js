var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
	url_local: { type: String, trim: true },
	url_remote: { type: String, trim: true },

	user: { type: Schema.Types.ObjectId, ref: 'User' },
	date: { type: Date, default: Date.now() },

	width: { type: Number },
	height: { type: Number },

	hash: { type: String, index: true, unique: true, trim: true }
});

module.exports = mongoose.Model('Image', ImageSchema);