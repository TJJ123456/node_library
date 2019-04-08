const BookInstanceModel = require('../models/bookinstance');
const BookModel = require('../models/book');
const moment = require('moment');

//获取书本实例信息
exports.bookinstance_list = function (req, res, next) {
    BookInstanceModel.find().populate('book').lean().then(result => {
        console.log(result);
        result.forEach(item => {
            item.due_back_formatted = moment(item.due_back).format('MMMM Do, YYYY');
        })
        res.render('bookinstance_list.html', {
                book_list: result
            });
    }).catch(next);
}

//书本实例详情页面
exports.bookinstance_detail = function (req, res, next) {
    const id = req.params.id;
    BookInstanceModel.findById(id).populate('book').lean().then(result => {
        console.log(result);
        res.render('bookinstance_detail.html', {
            bookinstance: result
        });
    }).catch(next);
}

//创建书本实例页面
exports.bookinstance_create_get = function (req, res, next) {
    BookModel.find({}, 'title').populate('author').then(result => {
        res.render('bookinstance_create.html', {
            book_list: result
        });
    }).catch(next);
}

//书本实例创建
exports.bookinstance_create_post = function (req, res, next) {
    const book = req.body.book.trim();
    const imprint = req.body.imprint.trim();
    const status = req.body.status.trim();
    try {
        if (!(book.length >= 1)) {
            throw new Error('书本不能为空')
        }
        if (!(imprint.length >= 1)) {
            throw new Error('出版信息不能为空')
        }
    } catch (e) {
        return res.json({
            error: true,
            msg: e.message
        })
    }
    const bookinstance = {
        book: book,
        imprint: imprint,
        status: status,
    }
    BookInstanceModel.create(bookinstance).then(result => {
        // console.log(result);
        // res.send('创建书本实例成功');
        res.redirect(result.url);
    })
}

//删除书本实例页面
exports.bookinstance_delete_get = function (req, res, next) {
    const id = req.params.id;
    BookInstanceModel.findById(id).populate('book').lean().then(result => {
        console.log(result);
        res.render('bookinstance_delete.html', {
            bookinstance: result
        });
        // res.send('删除页面');
    }).catch(next);
}

//删除书本实例请求
exports.bookinstance_delete_post = function (req, res, next) {
    const id = req.params.id;
    BookInstanceModel.findByIdAndRemove(id).then(result => {
        // res.send('删除成功');
        res.redirect('/catalog/bookinstances');
    }).catch(next);
}

//更新书本实例
exports.bookinstance_update_get = async function (req, res, next) {
    const id = req.params.id;
    try {
        const bookinstance = await BookInstanceModel.find(id).populate('book');
        const books = await BookModel.find({}, params).populate('author');
        if (!bookinstance) {
            return res.json({
                error: true,
                msg: '没这个书'
            })
        }
        res.render('bookinstance_form',
            {
                book_list: books,
                selected_book: bookinstance.book._id,
                bookinstance: bookinstance
            });
    } catch (e) {
        return res.json({
            error: true,
            msg: e.message
        })
    }

}

//更新书本实例请求
exports.bookinstance_update_post = function (req, res, next) {
    const id = req.params.id;
    const book = req.fields.book.trim();
    const imprint = req.fields.imprint.trim();
    const status = req.fields.status;
    const due_back = req.fields.due_back;

    try {
        if (!(book.length >= 1)) {
            throw new Error('书本不能为空')
        }
        if (!(imprint.length >= 1)) {
            throw new Error('出版信息不能为空')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back');
    }

    const bookinstance = {
        book: book,
        imprint: imprint,
        status: status,
        due_back: due_back,
        _id: id
    }

    BookInstanceModel.findByIdAndUpdate(id, bookinstance).then(result => {
        console.log(result);
        res.send('更新实例成功');
        // res.redirect(thebookinstance.url);
    })
}