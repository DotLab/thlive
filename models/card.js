var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
	rarity: { type: String, required: true, enum: [ 'N', 'R', 'SR', 'UR' ] },
	attribute: { type: String, required: true, enum: [ 'Haru', 'Rei', 'Ma' ] },

	character: { type: Schema.Types.ObjectId, ref: 'Character', required: true },

	portrait: {
		image: { type: Schema.Types.ObjectId, ref: 'Image' },
		position: { x: Number, y: Number},
		rotation: Number,
		scale: Number,
	},

	portrait_idolized: {
		image: { type: Schema.Types.ObjectId, ref: 'Image' },
		position: { x: Number, y: Number},
		rotation: Number,
		scale: Number,
	},

	background: {
		image: { type: Schema.Types.ObjectId, ref: 'Image' },
		position: { x: Number, y: Number},
		rotation: Number,
		scale: Number,
	},

	icon: {
		position: { x: Number, y: Number }
	},

	parent: { type: Schema.Types.ObjectId, ref: 'Card', default: null },

	sp_init: { type: Number, required: true },
	sp_max: { type: Number, required: true },

	haru_init: { type: Number, required: true },
	haru_max: { type: Number, required: true },

	rei_init: { type: Number, required: true },
	rei_max: { type: Number, required: true },

	ma_init: { type: Number, required: true },
	ma_max: { type: Number, required: true },

	note: { type: String, default: '', trim: true },
	editor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	reviewer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
	status: { type: String, enum: [ 'Suspended', 'Accepted', 'Rejected', 'Deprecated' ], default: 'Suspended' },

	votes_up: { type: Number, default: 0 },
	votes_down: { type: Number, default: 0 },
});

module.exports = mongoose.model('Card', CardSchema);