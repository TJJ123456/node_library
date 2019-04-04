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
exports.Genre = mongoose.model('Genre', GenreSchema);