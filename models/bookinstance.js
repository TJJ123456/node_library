const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const BookInstanceSchema = new Schema({
    // 指向相关藏书的引用
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    // 出版项
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['可供借阅', '馆藏维护', '已借出', '保留'],//使用枚举可以避免状态中出现错误的值
        default: '馆藏维护'
    },
    due_back: { type: Date, default: Date.now }//还书日期
}
);

// 虚拟属性'url'：藏书副本 URL
BookInstanceSchema
    .virtual('url')
    .get(function () {
        return '/catalog/bookinstance/' + this._id;
    });

// 导出 BookInstance 模型
const BookInstance = mongoose.model('BookInstance', BookInstanceSchema);
module.exports = {
    //通过书本id获取书籍实例
    getByBookId: function getByBookId(bookId) {
        return BookInstance.find({ book: bookId }).exec();
    },
    //书本实例总数
    getBookInstanceCount() {
        return BookInstance.countDocuments().exec();
    },
    //获取可借阅书本数量
    getAvailableCount() {
        return BookInstance.countDocuments({ status: '可供借阅' }).exec();
    },
    //获取所有书本实例
    getBookInstanceList() {
        return BookInstance.find().populate('book');
    },
    //创建书本
    create(bookinstance) {
        return BookInstance.create(bookinstance);
    },
    //获取单个书本实例信息
    getBookInstanceInfoById(bookinstanceId) {
        return BookInstance.find(bookinstanceId).populate('book').exec();
    },
    //通过id删除书本实例
    removeById(bookinstanceId) {
        return BookInstance.findByIdAndRemove(bookinstanceId).exec();
    },
    updateById(bookinstanceId, bookinstance) {
        return BookInstance.findByIdAndUpdate(bookinstanceId, bookinstance);
    }
}