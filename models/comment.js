var marked = require('marked');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	topic: { type: Schema.Types.ObjectId, required: true },
	
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	date: { type: Date, default: Date.now() },

	markdown: { type: String, required: true, minlength: 1 }
}, {
	toObject: { virtuals: true },
	toJSON: { virtuals: true }
});

CommentSchema.virtual('html').get(function () {
	return marked(this.markdown);
});

module.exports = mongoose.model('Comment', CommentSchema);