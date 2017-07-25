var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FlagSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	target: { type: Schema.Types.ObjectId, required: true },
	date: { type: Date, required: true, default: Date.now },

	flag: { type: String, required: true, enum: [ 'Spam', 'Rude', 'Poor', 'Flag' ] },
	reason: { type: String, required: true }
});

FlagSchema.index({ user: 1, target: 1 }, { unique: true });

module.exports = mongoose.model('Flag', FlagSchema);