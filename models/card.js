var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true, default: Date.now() },

	// main -------------------------------------------------------------------------
	rarity: { type: String, required: true, enum: [ 'n', 'r', 'sr', 'ur' ] },
	attribute: { type: String, required: true, enum: [ 'haru', 'rei', 'ma' ] },

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
	front_id: { type: Schema.Types.ObjectId, required: true, ref: 'Image' },
	front_i_id: { type: Schema.Types.ObjectId, required: true, ref: 'Image' },
	back_id: { type: Schema.Types.ObjectId, ref: 'Image' },
	back_i_id: { type: Schema.Types.ObjectId, ref: 'Image' },

	// transforms -------------------------------------------------------------------------
	front_x: { type: Number, required: true },
	front_y: { type: Number, required: true },
	front_rot: { type: Number, required: true },
	front_scl: { type: Number, required: true },

	front_i_x: { type: Number, required: true },
	front_i_y: { type: Number, required: true },
	front_i_rot: { type: Number, required: true },
	front_i_scl: { type: Number, required: true },

	back_x: { type: Number, required: true },
	back_y: { type: Number, required: true },
	back_rot: { type: Number, required: true },
	back_scl: { type: Number, required: true },

	back_i_x: { type: Number, required: true },
	back_i_y: { type: Number, required: true },
	back_i_rot: { type: Number, required: true },
	back_i_scl: { type: Number, required: true },

	icon_x: { type: Number, required: true },
	icon_y: { type: Number, required: true },
	icon_rot: { type: Number, required: true },
	icon_scl: { type: Number, required: true },

	icon_i_x: { type: Number, required: true },
	icon_i_y: { type: Number, required: true },
	icon_i_rot: { type: Number, required: true },
	icon_i_scl: { type: Number, required: true }
});

CardSchema.virtual('url').get(function () {
	return '/cards/' + this._id;
});

CardSchema.virtual('front_trans').get(function () {
	return `translate(${this.front_x} ${this.front_y}) rotate(${this.front_rot}) scale(${this.front_scl})`;
});

CardSchema.virtual('front_i_trans').get(function () {
	return `translate(${this.front_i_x} ${this.front_i_y}) rotate(${this.front_i_rot}) scale(${this.front_i_scl})`;
});

CardSchema.virtual('back_trans').get(function () {
	return `translate(${this.back_x} ${this.back_y}) rotate(${this.back_rot}) scale(${this.back_scl})`;
});

CardSchema.virtual('back_i_trans').get(function () {
	return `translate(${this.back_i_x} ${this.back_i_y}) rotate(${this.back_i_rot}) scale(${this.back_i_scl})`;
});

// max level without bond
CardSchema.virtual('level_no_bond').get(function () {
	return ({ n: 20, r: 40, sr: 60, ur: 80 })[this.rarity];
});

// max level with bond
CardSchema.virtual('level_max').get(function () {
	return ({ n: 40, r: 60, sr: 80, ur: 100 })[this.rarity];
});

CardSchema.methods.calcHaru = function (level) {
	var t = level / ({ n: 40, r: 60, sr: 80, ur: 100 })[this.rarity];
	Math.floor(haru_init + (haru_max - haru_init) * t)
}

CardSchema.methods.calcRei = function (level) {
	var t = level / ({ n: 40, r: 60, sr: 80, ur: 100 })[this.rarity];
	Math.floor(rei_init + (rei_max - rei_init) * t)
}

CardSchema.methods.calcMa = function (level) {
	var t = level / ({ n: 40, r: 60, sr: 80, ur: 100 })[this.rarity];
	Math.floor(ma_init + (ma_max - ma_init) * t)
}

module.exports = mongoose.model('Card', CardSchema);