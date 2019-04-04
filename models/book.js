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
const Book = mongoose.model('Book', BookSchema);

module.exports = {
    //通过作者获取书籍信息 (第二个参数是显示参数)
    getBookByAuthorId: function getBookByAuthorId(authorId, params) {
        return Book.find({ 'author': authorId }, params).exec();
    },
    //通过作者获取书籍所有信息
    getBookEveryThingById: function getBookEveryThingByAuthorId(bookId) {
        return Book.findById(bookId).populate('author').populate('genre').exec();
    },
    //通过id删除书本
    removeBookById: function removeBookById(bookId) {
        return Book.findByIdAndRemove(bookId).exec();
    },
    //获取书本数量
    getBookCount() {
        return Book.countDocuments().exec();
    },
    //获取所有书籍信息(包括作者)
    getBookList(params) {
        return Book.find({}, params).populate('author').exec();
    },
    //新建书本
    create(book) {
        return Book.create(book);
    },
    //通过id更新书本
    updateById(bookId, book) {
        return Book.findByIdAndUpdate(bookId, book).exec();
    },
    //通过种类id找书本
    getBookByGenreId(genreId) {
        return Book.find({ 'genre': genreId }).exec();
    }
}