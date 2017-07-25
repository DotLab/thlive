var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VoteSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	target: { type: Schema.Types.ObjectId, required: true },
	date: { type: Date, required: true, default: Date.now },

	// Approve Edit, Up Vote, Down Vote, Close Post, Open Post, Delete Post, Undetele Post
	vote: { type: String, required: true, enum: [ 'Approve', 'Up', 'Down', 'Close', 'Open', 'Delete', 'Undelete' ] }
});

module.exports = mongoose.model('Vote', VoteSchema);