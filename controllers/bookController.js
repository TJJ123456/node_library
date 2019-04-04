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
    BookModel.find({}, 'title author').populate('author').then(result => {
        // console.log(result);
        // res.send('书本列表');
        res.render('book_list.html', {
            title: 'Book List',
            books: result
        })
    }).catch(next)
}

//展示书本详细信息
exports.book_detail = function (req, res, next) {
    const bookId = req.params.id;
    Promise.all([
        BookModel.findById(bookId).populate('author').populate('genre'),
        BookInstanceModel.find({ book: bookId })
    ]).then(result => {
        const book = result[0];
        const book_instance = result[1];
        if (!book) {
            throw new Error('没这个书');
        }
        console.log(book);
        console.log(book_instance);
        res.send('书本详细信息')
        // res.render('book_detail',
        //     {
        //         title: 'Title',
        //         book: book,
        //         book_instances: book_instance
        //     });
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
        // res.render('book_form', {
        //     title: 'Create Book',
        //     authors: authors,
        //     genres: genres
        // });
        console.log('书本和种类');
        console.log(authors);
        console.log(genres);
        res.send('书本和种类');
    }).catch(next);
}

exports.book_create_post = function (req, res, next) {
    if (!(req.fields.genre instanceof Array)) {
        if (typeof req.fields.genre === 'undefined')
            req.fields.genre = [];
        else
            req.fields.genre = new Array(req.fields.genre);
    }
    const title = req.fields.title.trim();
    const author = req.fields.author.trim();
    const summary = req.fields.summary.trim();
    const isbn = req.fields.isbn.trim();

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
        genre: genre
    };
    BookModel.create(book).then(result => {
        console.log(result);
        res.send('创建书本成功');
    }).catch(next);
}

//删除书本页面
exports.book_delete_get = function (req, res, next) {
    const bookId = req.params.id;
    Promise.all([
        BookModel.findById(bookId).populate('author').populate('genre'),
        BookInstanceModel.find({ book: bookId })
    ]).then(result => {
        const book = result[0];
        const book_bookinstances = result[1];
        if (!book) { // 没有书
            res.redirect('/catalog/books');
        }
        res.render('book_delete', {
            title: 'Delete Book',
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
            res.render('book_delete', {
                title: 'Delete Book',
                book: book,
                book_instances: book_bookinstances
            });
            return;
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
        BookModel.findById(bookId).populate('author').populate('genre'),
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
                    genre.checked = 'true';
                }
            })
        })
        res.render('book_form', {
            title: 'Update Book',
            authors: authors,
            genres: genres,
            book: book
        });
    }).catch(next);
}

exports.book_update_post = function (req, res, next) {
    if (!(req.fields.genre instanceof Array)) {
        if (typeof req.fields.genre === 'undefined')
            req.fields.genre = [];
        else
            req.fields.genre = new Array(req.fields.genre);
    }

    const title = req.fields.title.trim();
    const author = req.fields.author.trim();
    const summary = req.fields.summary.trim();
    const isbn = req.fields.isbn.trim();

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
        console.log(result);
        res.send('更新书本成功');
    })
}