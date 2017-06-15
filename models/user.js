var moment = require('moment');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: { type: String, required: true, index: true, unique: true, trim: true, match: /^[^ ]{1,20}$/ },
	email: { type: String, required: true, index: true, unique: true, trim: true, match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ },

	salt: { type: String, required: true },
	hash: { type: String, required: true },

	avatar: { type: Schema.Types.ObjectId, ref: 'Image', default: null },

	reputation: { type: Number, default: 0 },

	count_image: { type: Number, default: 0 },
	count_card: { type: Number, default: 0 },

	date_joined: { type: Date, default: Date.now }

}, {
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

UserSchema.virtual('url').get(function () {
	return '/users/' + this._id;
});

UserSchema.virtual('tag').get(function () {
	return this._id.toString().substring(0, 7);
});

UserSchema.virtual('date_joined_formated').get(function () {
	return moment(this.date_joined).format('LLL');
});

module.exports = mongoose.model('User', UserSchema);