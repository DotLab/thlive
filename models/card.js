var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
	rarity: { type: String, required: true, enum: [ 'N', 'R', 'SR', 'SSR', 'UR' ] },

	character: { type: Schema.Types.ObjectId, ref: 'Character', required: true },
	title: { type: String, required: true, trim: true },

	portrait: { type: Schema.Types.ObjectId, ref: 'Image', required: true },
	icon: { type: Schema.Types.ObjectId, ref: 'Image', required: true },

	// a card that dose not have parent is the first version of the card
	parent: { type: Schema.Types.ObjectId, ref: 'Card', default: null },

	haru_init: { type: Number, required: true },
	haru_max: { type: Number, required: true },

	rei_init: { type: Number, required: true },
	rei_max: { type: Number, required: true },

	ma_init: { type: Number, required: true },
	ma_max: { type: Number, required: true },
});

module.exports = mongoose.model('Card', CardSchema);