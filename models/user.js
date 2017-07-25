var moment = require('moment');
var marked = require('marked');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true, unique: true, trim: true, match: /^[^ ]{1,20}$/ },
	email: { type: String, required: true, unique: true, trim: true, match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ },

	title: { type: String, default: '' },
	location: { type: String, default: '' },
	markdown: { type: String, default: '' },

	salt: { type: String, required: true },
	hash: { type: String, required: true },

	avatar: { type: Schema.Types.ObjectId, ref: 'Image', default: null },

	reputation: { type: Number, default: 0 },
	modulator: { type: Boolean, default: false },

	votes: { type: Number, default: 0 },
	edits: { type: Number, default: 0 },

	badge_gold: { type: Number, default: 0 },
	badge_silver: { type: Number, default: 0 },
	badge_brozen: { type: Number, default: 0 },

	date_joined: { type: Date, default: Date.now },
	date_active: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);