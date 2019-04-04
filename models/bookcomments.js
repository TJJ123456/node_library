const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookcommentsSchema = new Schema({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    comment: { type: String, minlength: 1, required: true },//评论内容
    reader: { type: Schema.Types.ObjectId, ref: 'Reader', required: true }
})

exports.BookComments = mongoose.model('BookComments', bookcommentsSchema);