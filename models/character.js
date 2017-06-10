var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
	avatar: { type: Schema.Types.ObjectId, ref: 'Image', default: null },
	
	name_jp: { type: String, required: true, index: true, unique: true, trim: true },
	name_zh: { type: String, required: true, index: true, unique: true, trim: true },
	name_en: { type: String, required: true, index: true, unique: true, trim: true },

	age: { type: String, required: true, trim: true },
	race: { type: String, required: true, trim: true },

	skills: [{ type: String, trim: true }],
	titles: [{ type: String, trim: true }]
}, {
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

CharacterSchema.virtual('url_detail').get(function () {
	return '/characters/' + this._id;
});

module.exports = mongoose.model('Character', CharacterSchema);