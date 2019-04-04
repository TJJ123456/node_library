const BookInstanceModel = require('../models/bookinstance');
const BookModel = require('../models/book');

//获取书本实例信息
exports.bookinstance_list = function (req, res, next) {
    BookInstanceModel.getBookInstanceList().then(result => {
        console.log(result);
        let data = JSON.stringify(result);
        data = JSON.parse(data);
        res.render('bookinstance_list.html', {
            bookinstance_list: data
        });
        // res.send({
        //     bookinstance_list: result
        // })
        // res.send('信息太大了不发了');
    }).catch(next);
}

//书本实例详情页面
exports.bookinstance_detail = function (req, res, next) {
    const id = req.params.id;
    BookInstanceModel.getBookInstanceInfoById(id).then(result => {
        console.log(result);
        // res.render('bookinstance_delete', {
        //     title: 'Delete BookInstance',
        //     bookinstance: bookinstance
        // });
        res.send('详情页面');
    }).catch(next);
}

//创建书本实例页面
exports.bookinstance_create_get = function (req, res, next) {
    BookModel.getBookList('title').then(result => {
        res.send('书本信息');
        // res.render('bookinstance_form', {
        //     title: 'Create BookInstance',
        //     book_list: books
        // });
    }).catch(next);
}

//书本实例创建
exports.bookinstance_create_post = function (req, res, next) {
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
        due_back: due_back
    }
    BookInstanceModel.create(bookinstance).then(result => {
        console.log(result);
        res.send('创建书本实例成功');
        // res.redirect(bookinstance.url);
    })
}

//删除书本实例页面
exports.bookinstance_delete_get = function (req, res, next) {
    const id = req.params.id;
    BookInstanceModel.getBookInstanceInfoById(id).then(result => {
        console.log(result);
        // res.render('bookinstance_delete', {
        //     title: 'Delete BookInstance',
        //     bookinstance: bookinstance
        // });
        res.send('删除页面');
    }).catch(next);
}

//删除书本实例请求
exports.bookinstance_delete_post = function (req, res, next) {
    const id = req.params.id;
    BookInstanceModel.removeById(id).then(result => {
        console.log(result);
        // res.redirect('/catalog/bookinstances');
        res.send('删除成功');
    }).catch(next);
}

//更新书本实例
exports.bookinstance_update_get = async function (req, res, next) {
    const id = req.params.id;
    try {
        const bookinstance = await BookInstanceModel.getBookInstanceInfoById(id);
        const books = await BookModel.getBookList();
        if (!bookinstance) {
            throw new Error('没这书');
        }
        res.render('bookinstance_form',
            {
                title: 'Update  BookInstance',
                book_list: books,
                selected_book: bookinstance.book._id,
                bookinstance: bookinstance
            });
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('back');
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

    BookInstanceModel.updateById(id, bookinstance).then(result => {
        console.log(result);
        res.send('更新实例成功');
        // res.redirect(thebookinstance.url);
    })
}