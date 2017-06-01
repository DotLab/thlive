var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CharacterSchema = new Schema({
	name_jp: { type: String, required: true, index: true, unique: true, trim: true },
	name_zh: { type: String, required: true, index: true, unique: true, trim: true },
	name_en: { type: String, required: true, index: true, unique: true, trim: true },

	age: { type: String, required: true, trim: true },
	race: { type: String, required: true, trim: true },
	skill: { type: String, required: true, trim: true }
});

module.exports = mongoose.model('Character', CharacterSchema);