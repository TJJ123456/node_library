const GenreModel = require('../models/genre');
const BookModel = require('../models/book');

//展示种类列表
exports.genre_list = function (req, res, next) {
    GenreModel.find().then(result => {
        console.log(result);
        // res.send('这是种类列表');
        res.render('genre_list.html', {
            list_genres: result
        });
    })
}

//展示种类细节
exports.genre_detail = async function (req, res, next) {
    const genreId = req.params.id;
    try {
        const genre = await GenreModel.findById(genreId);
        const genre_books = await BookModel.find({ 'genre': genreId }).populate('author').lean();
        if (!genre) {
            throw new Error('没这个种类');
        }
        res.render('genre_detail.html', {
            genre: genre,
            genre_books: genre_books.length === 0 ? false : genre_books
        });
    } catch (e) {
        res.json({
            error: true,
            msg: e.message
        })
    }
}

//展示创建种类表单
exports.genre_create_get = function (req, res, next) {
    res.render('genre_form.html', { title: '创建种类' });
};

//创建种类表单请求
exports.genre_create_post = function (req, res, next) {
    const name = req.body.genrename.trim();
    //校验
    try {
        if (!(name.length >= 1)) {
            throw new Error('名字不能为空')
        }
    } catch (e) {
        // req.flash('error', e.message)
        res.json({
            error: true,
            msg: e.message
        })
        // return res.redirect('back');
    }
    GenreModel.findOne({ name: name }).then(result => {
        if (result) {
            // res.redirect(found_genre.url);
            res.json({
                error: true,
                msg: "种类已经存在"
            })
        } else {
            console.log(result);
            // res.send('这里应该保存？');
            GenreModel.create({ name: name }).then(item => {
                res.redirect(item.url);
            }).catch(e => {
                res.json({
                    error: true,
                    msg: e.message
                })
            })
        }
    })
}
//展示删除种类页面
exports.genre_delete_get = async function (req, res, next) {
    const genreId = req.params.id;
    try {
        const genre = await GenreModel.findById(genreId);
        const genre_books = await BookModel.find({ 'genre': genreId }).populate('author').lean();
        if (!genre) {
            res.redirect('/catalog/genres');
        } else {
            res.render('genre_delete.html', {
                genre: genre,
                genre_books: genre_books
            });
        }
    } catch (e) {
        res.json({
            error: true,
            msg: e.message
        })
    }
}

//删除种类请求
exports.genre_delete_post = async function (req, res, next) {
    const genreId = req.params.id;
    try {
        const genre = await GenreModel.findById(genreId);
        const genre_books = await BookModel.find({ 'genre': genreId });
        if (genre_books.length > 0) {
            // Genre has books. Render in same way as for GET route.
            res.render('genre_delete', {
                title: 'Delete Genre',
                genre: genre,
                genre_books: genre_books
            });
            return;
        } else {
            await GenreModel.findByIdAndRemove(genreId);
            res.redirect('/catalog/genres');
        }
    } catch (e) {
        res.json({
            error: true,
            msg: e.message
        })
    }
}

//更新种类页面
exports.genre_update_get = function (req, res, next) {
    const genreId = req.params.id;
    GenreModel.findById(genreId).then(result => {
        // res.send('种类');
        res.render('genre_update.html', { genre: result });
    })
}

//更新种类请求
exports.genre_update_post = function (req, res, next) {
    const name = req.body.genrename.trim();
    const genreId = req.params.id;
    //校验
    try {
        if (!(name.length >= 1)) {
            throw new Error('名字不能为空')
        }
    } catch (e) {
        res.json({
            error: true,
            msg: e.message
        })
    }

    const genre = {
        name: name,
        _id: genreId
    }

    GenreModel.findByIdAndUpdate(genreId, genre).then(result => {
        // console.log(result);
        // res.send('更新种类成功了？');
        res.redirect(result.url);
    })
}