var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CardInstanceSchema = new Schema({
	user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true, default: Date.now() },

	card_id: { type: Schema.Types.ObjectId, ref: 'Card', required: true },

	level: { type: Number, required: true, default: 1 },
	bond: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('CardInstance', CardInstanceSchema);