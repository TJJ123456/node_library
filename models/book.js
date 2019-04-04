const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: { type: String, required: true },//书名
    author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },//作者
    summary: { type: String, required: true },//摘要
    isbn: { type: String, required: true },//书号
    genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }]//类别
});

// 虚拟属性'url'：藏书 URL
BookSchema
    .virtual('url')
    .get(function () {
        return '/catalog/book/' + this._id;
    });

// 导出 Book 模块
module.exports = mongoose.model('Book', BookSchema);