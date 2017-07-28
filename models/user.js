var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true, unique: true, trim: true, match: /^[a-zA-Z0-9 \u3040-\u309f\u30a0-\u30ff\u4E00-\u9FFF\uF900-\uFAFF]{1,20}$/ },
	email: { type: String, required: true, unique: true, trim: true, match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ },
	
	website: { type: String, trim: true },

	title: { type: String, required: true, trim: true, default: 'Friend' },
	location: { type: String, required: true, trim: true, default: 'Earth' },
	about_me: { type: String, required: true, trim: true, default: 'Apparently, this user prefers to keep an air of mystery about them.' },

	salt: { type: String, required: true },
	hash: { type: String, required: true },

	is_mod: { type: Boolean, required: true, default: false },
	rep: { type: Number, required: true, default: 1 },
	
	views: { type: Number, required: true, default: 0 },
	
	edits: { type: Number, required: true, default: 0 },
	up_votes: { type: Number, required: true, default: 0 },
	down_votes: { type: Number, required: true, default: 0 },

	date: { type: Date, required: true, default: Date.now },
	active_date: { type: Date, required: true, default: Date.now },

	edit_scores: { type: Number, required: true, default: 0 },
	tag_scores: { type: Number, required: true, default: 0 },
	image_scores: { type: Number, required: true, default: 0 },
});

UserSchema.virtual('url').get(function () {
	return '/users/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);