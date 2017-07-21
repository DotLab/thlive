var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArchiveSchema = new Schema({
	date: { type: Date, default: Date.now(), required: true },
	
	collection: { type: String, required: true, index: true }
	document: { type: String, required: true, index: true, unique: true }
});

module.exports = mongoose.model('Archive', ArchiveSchema);