const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    name: { type: String, required: true, min: 3, max: 100 }
});

// 获取类别的 URL.
GenreSchema
    .virtual('url')
    .get(function () {
        return '/catalog/genre/' + this._id;
    });

// 导出 model.
const Genre = mongoose.model('Genre', GenreSchema);
module.exports = {
    //种类总数
    getGenreCount() {
        return Genre.countDocuments().exec();
    },
    //获取所有种类表单
    getGenreList() {
        return Genre.find({}).exec();
    },
    //根据id获取种类信息
    getGenreById(genreId) {
        return Genre.findById(genreId).exec();
    },
    //通过名字获取种类信息
    getGenreByName(name) {
        return Genre.findOne({ name: name }).exec();
    },
    //通过id删除种类
    removeById(genreId) {
        return Genre.findByIdAndRemove(genreId).exec();
    },
    //通过id更新种类
    updateById(genreId, genre) {
        return Genre.findByIdAndUpdate(genreId, genre).exec();
    },
}