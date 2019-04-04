const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthorSchema = new Schema(
    {
        first_name: { type: String, required: true, max: 100 },
        family_name: { type: String, required: true, max: 100 },
        date_of_birth: { type: Date },
        date_of_death: { type: Date },
    }
);

// 虚拟属性'name'：表示作者全名
AuthorSchema
    .virtual('name')
    .get(function () {
        return this.family_name + ', ' + this.first_name;
    });

// 虚拟属性'lifespan'：作者寿命
AuthorSchema
    .virtual('lifespan')
    .get(function () {
        return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
    });

// 虚拟属性'url'：作者 URL
AuthorSchema
    .virtual('url')
    .get(function () {
        return '/catalog/author/' + this._id;
    });

// 导出 Author 模型
const Author = mongoose.model('Author', AuthorSchema);

module.exports = {
    getAuthorList: function getAuthorList() {
        return Author.find({}).exec();
    },
    getAuthorById: function getAuthorById(authorId) {
        return Author.findById(authorId).exec();
    },
    create: function create(author) {
        return Author.create(author);
    },
    removeById: function removeBookById(authorId) {
        return Author.findByIdAndRemove(authorId).exec();
    },
    //通过id更新作者信息
    updateById(authorId, author) {
        return Author.updateById(authorId, author).exec();
    },
    //获取作者总数
    getAuthorCount() {
        return Author.countDocuments().exec();
    }
}