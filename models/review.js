var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
	for: { type: Schema.Types.ObjectId },
	type: { type: String, required: true, default: 'create', enum: [ 'create', 'edit', 'rollback', 'close', 'delete' ] },

	reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true, default: Date.now },
	
	result: { type: String, required: true, enum: [ 'approved', 'rejected', 'skipped' ] },

	comment: { type: String, trim: true }
});
// , {
// 	toObject: { virtuals: true },
// 	toJSON: { virtuals: true }
// });

ReviewSchema.virtual('master').get(function () {
	return this.slaves[0];
});

module.exports = mongoose.model('Review', ReviewSchema);