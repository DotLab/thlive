var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
	editor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, default: Date.now() },

	reviewer: { type: Schema.Types.ObjectId, ref: 'User', default: null },
	review: { type: String, default: '', trim: true },
	status: { type: String, enum: [ 'Suspended', 'Accepted', 'Rejected', 'Deprecated' ], default: 'Suspended' },

	votes_up: { type: Number, default: 0 },
	votes_down: { type: Number, default: 0 },

	// main -------------------------------------------------------------------------
	parent: { type: Schema.Types.ObjectId, ref: 'Card', default: null },
	character: { type: Schema.Types.ObjectId, ref: 'Character', required: true },
	
	rarity: { type: String, required: true, enum: [ 'N', 'R', 'SR', 'UR' ] },
	attribute: { type: String, required: true, enum: [ 'Haru', 'Rei', 'Ma' ] },

	// parameters -------------------------------------------------------------------------
	sp_init: { type: Number, required: true },
	sp_max: { type: Number, required: true },

	haru_init: { type: Number, required: true },
	haru_max: { type: Number, required: true },

	rei_init: { type: Number, required: true },
	rei_max: { type: Number, required: true },

	ma_init: { type: Number, required: true },
	ma_max: { type: Number, required: true },

	// images -------------------------------------------------------------------------
	portrait: { type: Schema.Types.ObjectId, ref: 'Image' },
	background: { type: Schema.Types.ObjectId, ref: 'Image' },
	portrait_idolized: { type: Schema.Types.ObjectId, ref: 'Image' },
	background_idolized: { type: Schema.Types.ObjectId, ref: 'Image' },

	// transforms -------------------------------------------------------------------------
	portrait_x: { type: Number, required: true },
	portrait_y: { type: Number, required: true },
	portrait_rotation: { type: Number, required: true },
	portrait_scale: { type: Number, required: true },

	portrait_idolized_x: { type: Number, required: true },
	portrait_idolized_y: { type: Number, required: true },
	portrait_idolized_rotation: { type: Number, required: true },
	portrait_idolized_scale: { type: Number, required: true },

	background_x: { type: Number, required: true },
	background_y: { type: Number, required: true },
	background_rotation: { type: Number, required: true },
	background_scale: { type: Number, required: true },

	background_idolized_x: { type: Number, required: true },
	background_idolized_y: { type: Number, required: true },
	background_idolized_rotation: { type: Number, required: true },
	background_idolized_scale: { type: Number, required: true },

	icon_x: { type: Number, required: true },
	icon_y: { type: Number, required: true },
	icon_rotation: { type: Number, required: true },
	icon_scale: { type: Number, required: true },

	icon_idolized_x: { type: Number, required: true },
	icon_idolized_y: { type: Number, required: true },
	icon_idolized_rotation: { type: Number, required: true },
	icon_idolized_scale: { type: Number, required: true }
}, {
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

CardSchema.virtual('url_detail').get(function () {
	return '/cards/' + this._id;
});

module.exports = mongoose.model('Card', CardSchema);