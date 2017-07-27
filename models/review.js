var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewSchema = new Schema({
	for: { type: Schema.Types.ObjectId },

	reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, required: true, default: Date.now },
	
	action: { type: String, required: true, enum: [ 'approve', 'reject', 'skip' ] },
	binding: { type: Boolean, required: true, default: false },

	comment: { type: String, trim: true }
});
// , {
// 	toObject: { virtuals: true },
// 	toJSON: { virtuals: true }
// });

ReviewSchema.index({ for: 1, reviewer: 1 }, { unique: true });

ReviewSchema.virtual('master').get(function () {
	return this.slaves[0];
});

module.exports = mongoose.model('Review', ReviewSchema);