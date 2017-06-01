var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true, index: true, unique: true, trim: true, match: /[^ ]+/ },
	email: { type: String, required: true, index: true, unique: true, trim: true, match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ },
	password: { type: String, required: true, trim: true },

	avatar: { type: Schema.Types.ObjectId, ref: 'Image' },

	reputation: { type: Number, default: 0 },

	date_joined: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);