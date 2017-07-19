var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
	avatar: { type: Schema.Types.ObjectId, ref: 'Image', default: null },
	
	name_jp: { type: String, required: true, index: true, unique: true, trim: true },
	name_zh: { type: String, required: true, index: true, unique: true, trim: true },
	name_en: { type: String, required: true, index: true, unique: true, trim: true },

	age: { type: String, required: true, trim: true },
	race: { type: String, required: true, trim: true },

	residence: { type: String, required: true, trim: true },
	profession: { type: String, required: true, trim: true },

	markdown: { type: String, default: '', trim: true }
});

module.exports = mongoose.model('Character', CharacterSchema);