const BookModel = require('../models/book');
const AuthorModel = require('../models/author');
const GenreModel = require('../models/genre');
const BookInstanceModel = require('../models/bookinstance');

//主页
exports.index = function (req, res, next) {
    Promise.all([
        BookModel.countDocuments(),
        BookInstanceModel.countDocuments(),
        BookInstanceModel.countDocuments({ status: '可供借阅' }),
        AuthorModel.countDocuments(),
        GenreModel.countDocuments()
    ]).then(result => {
        const book_count = result[0];
        const book_instance_count = result[1];
        const book_instance_available_count = result[2];
        const author_count = result[3];
        const genre_count = result[4];

        // res.render('manager.html', {
        //     title: 'My Library',
        //     data: {
        //         book_count: book_count,
        //         book_instance_count: book_instance_count,
        //         book_instance_available_count: book_instance_available_count,
        //         author_count: author_count,
        //         genre_count: genre_count
        //     }
        // })
        res.json({
            book_count: book_count,
            book_instance_count: book_instance_count,
            book_instance_available_count: book_instance_available_count,
            author_count: author_count,
            genre_count: genre_count
        })
    }).catch(next);
}

//展示所有书本
exports.book_list = function (req, res, next) {
    BookModel.find().populate('author').populate('genre').lean().then(result => {
        res.render('book_list.html', { data: result });
    }).catch(next)
}

//展示书本详细信息
exports.book_detail = function (req, res, next) {
    const bookId = req.params.id;
    Promise.all([
        BookModel.findById(bookId).populate('author').populate('genre').lean(),
        BookInstanceModel.find({ book: bookId })
    ]).then(result => {
        const book = result[0];
        const book_instance = result[1];
        if (!book) {
            throw new Error('没这个书');
        }
        res.render('book_detail.html',
            {
                book: book,
                book_instances: book_instance
            });
    }).catch(next);
}

//创建书本页面
exports.book_create_get = function (req, res, next) {
    Promise.all([
        AuthorModel.find(),
        GenreModel.find()
    ]).then(result => {
        const authors = result[0];
        const genres = result[1];
        res.render('book_create.html', {
            authors: authors,
            genres: genres
        });
    }).catch(e => {
        res.json({
            error: true,
            msg: e.message
        })
    });
}

exports.book_create_post = function (req, res, next) {
    if (!(req.body.genre instanceof Array)) {
        if (typeof req.body.genre === 'undefined')
            req.body.genre = [];
        else
            req.body.genre = new Array(req.body.genre);
    }
    const title = req.body.title.trim();
    const author = req.body.author.trim();
    const summary = req.body.summary.trim();
    const isbn = req.body.isbn.trim();
    const genre = req.body.genre;

    //数据校验
    try {
        if (!(title.length >= 1)) {
            throw new Error('书名不能为空')
        }
        if (!(author.length >= 1)) {
            throw new Error('作者不能为空')
        }
        if (!(summary.length >= 1)) {
            throw new Error('摘要不能为空')
        }
        if (!(isbn.length >= 1)) {
            throw new Error('书号不能为空')
        }
    } catch (e) {
        return res.json({
            error: true,
            msg: e.message
        })
    }
    const book = {
        title: title,
        author: author,
        summary: summary,
        isbn: isbn,
        genre: genre
    };
    BookModel.create(book).then(result => {
        console.log(result);
        return res.redirect(result.url);
    }).catch(e => {
        return res.json({
            error: true,
            msg: e.message
        })
    });
}

//删除书本页面
exports.book_delete_get = function (req, res, next) {
    const bookId = req.params.id;
    Promise.all([
        BookModel.findById(bookId).populate('author').populate('genre').lean(),
        BookInstanceModel.find({ book: bookId })
    ]).then(result => {
        const book = result[0];
        const book_bookinstances = result[1];
        if (!book) { // 没有书
            // res.redirect('/catalog/books');
            res.json({
                error: true,
                msg: '书籍错误'
            })
        }
        res.render('book_delete.html', {
            book: book,
            book_instances: book_bookinstances
        });
    }).catch(next);
}

//删除书本请求
exports.book_delete_post = (req, res, next) => {
    const bookId = req.params.id;
    Promise.all([
        BookModel.findById(bookId).populate('author').populate('genre'),
        BookInstanceModel.find({ book: bookId })
    ]).then(result => {
        const book = result[0];
        const book_bookinstances = result[1];
        if (book_bookinstances.length > 0) {
            return res.json({
                error: true,
                msg: '请先删除相关书籍实例'
            });
        } else {
            BookModel.findByIdAndRemove(bookId).then(result => {
                res.redirect('/catalog/books');
            })
        }
    }).catch(next);
}

//更新书本信息页面
exports.book_update_get = function (req, res, next) {
    const bookId = req.params.id;
    Promise.all([
        BookModel.findById(bookId).populate('author').populate('genre').lean(),
        AuthorModel.find(),
        GenreModel.find()
    ]).then(result => {
        const book = result[0];
        const authors = result[1];
        const genres = result[2];
        if (!book) {
            throw new Error('没这书');
        }
        genres.forEach((genre, index) => {
            book.genre.forEach((bookgenre) => {
                if (bookgenre._id.toString() === genre._id.toString()) {
                    genre.checked = true;
                }
            })
        })
        res.render('book_update.html', {
            authors: authors,
            genres: genres,
            book: book
        });
    }).catch(next);
}

exports.book_update_post = function (req, res, next) {
    if (!(req.body.genre instanceof Array)) {
        if (typeof req.body.genre === 'undefined')
            req.body.genre = [];
        else
            req.body.genre = new Array(req.fields.genre);
    }

    const title = req.body.title.trim();
    const author = req.body.author.trim();
    const summary = req.body.summary.trim();
    const isbn = req.body.isbn.trim();

    //数据校验
    try {
        if (!(title.length >= 1)) {
            throw new Error('书名不能为空')
        }
        if (!(author.length >= 1)) {
            throw new Error('作者不能为空')
        }
        if (!(summary.length >= 1)) {
            throw new Error('摘要不能为空')
        }
        if (!(isbn.length >= 1)) {
            throw new Error('书号不能为空')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back');
    }

    const book = {
        title: title,
        author: author,
        summary: summary,
        isbn: isbn,
        genre: (typeof req.fields.genre === 'undefined') ? [] : req.fields.genre,
        _id: req.params.id // 
    }
    BookModel.findByIdAndUpdate(bookId, book).then(result => {
        // res.send('更新书本成功');
        res.redirect(result.url);
    })
}