const GenreModel = require('../models/genre');
const BookModel = require('../models/book');

//展示种类列表
exports.genre_list = function (req, res, next) {
    GenreModel.getGenreList().then(result => {
        console.log(result);
        res.send('这是种类列表');
        // res.render('genre_list', {
        //     title: 'Genre List',
        //     list_genres: list_genres
        // });
    })
}

//展示种类细节
exports.genre_detail = async function (req, res, next) {
    const genreId = req.params.id;
    try {
        const genre = await GenreModel.getGenreById(genreId);
        const genre_books = await BookModel.getBookByGenreId(genreId);
        if (!genre) {
            throw new Error('没这个种类');
        }
        res.render('genre_detail', {
            title: 'Genre Detail',
            genre: genre,
            genre_books: genre_books
        });
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back');
    }
}

//展示创建种类表单
exports.genre_create_get = function (req, res, next) {
    res.render('genre_form', { title: 'Create Genre' });
};

//创建种类表单请求
exports.genre_create_post = function (req, res, next) {
    const name = req.fields.name.trim();
    //校验
    try {
        if (!(name.length >= 1)) {
            throw new Error('书名不能为空')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back');
    }
    GenreModel.getGenreByName(name).then(result => {
        if (result) {
            res.redirect(found_genre.url);
        } else {
            console.log(result);
            res.send('这里应该保存？');
        }
    })
}
//展示删除种类页面
exports.genre_delete_get = async function (req, res, next) {
    const genreId = req.params.id;
    try {
        const genre = await GenreModel.getGenreById(genreId);
        const genre_books = await BookModel.getBookByGenreId(genreId);
        if (!genre) {
            res.redirect('/catalog/genres');
        } else {
            res.render('genre_delete', {
                title: 'Delete Genre',
                genre: genre,
                genre_books: genre_books
            });
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back');
    }
}

//删除种类请求
exports.genre_delete_post = async function (req, res, next) {
    const genreId = req.params.id;
    try {
        const genre = await GenreModel.getGenreById(genreId);
        const genre_books = await BookModel.getBookByGenreId(genreId);
        if (genre_books.length > 0) {
            // Genre has books. Render in same way as for GET route.
            res.render('genre_delete', {
                title: 'Delete Genre',
                genre: genre,
                genre_books: genre_books
            });
            return;
        } else {
            await GenreModel.removeById(genreId);
            res.redirect('/catalog/genres');
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back');
    }
}

//更新种类页面
exports.genre_update_get = function (req, res, next) {
    const genreId = req.params.id;
    GenreModel.getGenreById(genreId).then(result => {
        console.log(result);
        res.send('种类');
        // res.render('genre_form', { title: 'Update Genre', genre: genre });
    })
}

//更新种类请求
exports.genre_update_post = function (req, res, next) {
    const name = req.fields.name.trim();
    const id = req.params._id;
    //校验
    try {
        if (!(name.length >= 1)) {
            throw new Error('书名不能为空')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back');
    }

    const genre = {
        name: name,
        _id: id
    }

    GenreModel.updateById(genreId, genre).then(result => {
        console.log(result);
        res.send('更新种类成功了？');
        // res.redirect()
    })
}