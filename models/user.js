var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true, unique: true, trim: true, match: /^[^ ].{0,30}$/ },
	uuid: { type: String, required: true, unique: true, trim: true, match: /^[a-z][a-z0-9\-]{0,30}$/ },
	email: { type: String, required: true, unique: true, trim: true, match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ },

	avatar: { type: Schema.Types.ObjectId, ref: 'Image', default: null },
	
	title: { type: String, required: true, default: 'Unknown' },
	location: { type: String, required: true, default: 'Earth' },
	markdown: { type: String, required: true, default: 'Apparently, this user prefers to keep an air of mystery about them.' },

	salt: { type: String, required: true },
	hash: { type: String, required: true },

	moderator: { type: Boolean, required: true, default: false },
	
	reputation: { type: Number, required: true, default: 1 },

	view: { type: Number, required: true, default: 0 },
	edit: { type: Number, required: true, default: 0 },

	vote_up: { type: Number, required: true, default: 0 },
	vote_down: { type: Number, required: true, default: 0 },

	badge_gold: { type: Number, required: true, default: 0 },
	badge_silver: { type: Number, required: true, default: 0 },
	badge_brozen: { type: Number, required: true, default: 0 },

	date_joined: { type: Date, required: true, default: Date.now },
	date_active: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);