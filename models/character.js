var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
	avatar: { type: Schema.Types.ObjectId, ref: 'Image' },
	
	name_zh: { type: String, required: true, index: true, unique: true, trim: true },
	name_ja: { type: String, required: true, index: true, unique: true, trim: true },
	name_en: { type: String, required: true, index: true, unique: true, trim: true },

	name_ja_romaji: { type: String, trim: true },

	age: { type: String, trim: true },
	race: { type: String, trim: true },

	residence: { type: String, trim: true },
	profession: { type: String, trim: true },

	markdown: { type: String, trim: true }
});

module.exports = mongoose.model('Character', CharacterSchema);