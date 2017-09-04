var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var regexpHelper = require('../helpers/regexpHelper');
var schemaHelper = require('../helpers/schemaHelper');

var UserSchema = new Schema({
	name:{ type: String, required: true, unique: true, trim: true, match: regexpHelper.model.user.name },
	email:{ type: String, required: true, unique: true, trim: true, match: regexpHelper.model.user.email },
	
	website: { type: String, trim: true },

	title: { type: String, required: true, trim: true, default: 'Friend' },
	location: { type: String, required: true, trim: true, default: 'Earth' },
	about_me: { type: String, required: true, trim: true, default: 'Apparently, this user prefers to keep an air of mystery about them.' },

	salt: { type: String, required: true },
	hash: { type: String, required: true },

	is_mod: { type: Boolean, required: true, default: false },
	rep: { type: Number, required: true, default: 1 },
	
	views: schemaHelper.requiredNumber(0),
	
	edits: schemaHelper.requiredNumber(0),
	up_votes: schemaHelper.requiredNumber(0),
	down_votes: schemaHelper.requiredNumber(0),

	date: { type: Date, required: true, default: Date.now },
	active_date: { type: Date, required: true, default: Date.now },

	edit_scores: schemaHelper.requiredNumber(0),
	tag_scores: schemaHelper.requiredNumber(0),
	image_scores: schemaHelper.requiredNumber(0),
});

UserSchema.virtual('url').get(function () {
	return '/users/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);