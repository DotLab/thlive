var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VoteSchema = new Schema({
	topic: { type: Schema.Types.ObjectId, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },

	date: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Vote', VoteSchema);