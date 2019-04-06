const AuthorModel = require('../models/author');
const BookModel = require('../models/book');
const BookInstanceModel = require('../models/bookinstance');

//显示完整的作者列表
exports.author_list = (req, res, next) => {
    //按名字排序
    AuthorModel.find().then((result) => {
        result.sort((a, b) => a.family_name > b.family_name);
        console.log(result);
        res.render('author_list.html', {
            author_list: result
        });
        // res.json({ result });

    }).catch(next);
};

// 为每位作者显示详细信息的页面
exports.author_detail = (req, res, next) => {
    const authorId = req.params.id;
    Promise.all([
        AuthorModel.findById(authorId),
        BookModel.find({ 'author': authorId }, 'title summary')
    ]).then((result) => {
        const author = result[0];//作者信息
        const author_books = result[1];//作者的书的信息
        if (!author) {
            throw new Error('作者不存在');
        }
        res.render('author_detail', {
            title: 'Author Detail',
            author: author,
            author_books: author_books
        });
    }).catch(next);
};

// 由 GET 显示创建作者的表单
exports.author_create_get = (req, res, next) => {
    res.render('author_form', { title: 'Create Author' });
};

// 由 POST 处理作者创建操作
exports.author_create_post = (req, res, next) => {
    const first_name = req.fields.first_name;
    const family_name = req.fields.family_name;
    const date_of_birth = req.fields.date_of_birth;
    const date_of_death = req.fields.date_of_death;

    // 校验参数
    try {
        if (!(first_name.length >= 1)) {
            throw new Error('请写入姓')
        }
        if (!(family_name.length >= 1)) {
            throw new Error('请写入名')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('/author_form')
    }
    const author = {
        first_name: first_name,
        family_name: family_name,
        date_of_birth: date_of_birth,
        date_of_death: date_of_death,
    }
    AuthorModel.create(author).then(result => {
        console.log(result);
        res.send('创建成功看日志');
    })
};

// 由 GET 显示删除作者的表单
exports.author_delete_get = (req, res, next) => {
    const authorId = req.params.id;
    Promise.all([
        AuthorModel.findById(authorId),
        BookModel.find({ 'author': authorId })
    ]).then(result => {
        const author = result[0];
        const author_books = result[1];
        if (!author) { // 如果没有这个作者.
            throw new Error('没这个作者')
        }
        res.render('author_detail', {
            title: 'Author Detail',
            author: author,
            author_books: author_books
        });
    }).catch(next)
};

// 由 POST 处理作者删除操作
exports.author_delete_post = (req, res, next) => {
    const authorId = req.params.id;
    Promise.all([
        AuthorModel.findById(authorId),
        BookModel.getBookByAuthorId({ 'author': authorId })
    ]).then(result => {
        const author = result[0];
        const author_books = result[1];
        if (authors_books.length > 0) { // 如果作者有书，先删除书
            res.render('author_delete', {
                title: 'Delete Author',
                author: author,
                author_books: author_books
            });
            return;
        } else {
            AuthorModel.findByIdAndRemove(authorId).then(result => {
                res.redirect('/catalog/authors');
            })
        }
    }).catch(next);
};

// 由 GET 显示更新作者的表单
exports.author_update_get = (req, res, next) => {
    const authorId = req.params.id;
    AuthorModel.findById(authorId).then(result => {
        console.log(result);
        res.send('看日志更新作者表单');
    }).catch(next(err));
};

// 由 POST 处理作者更新操作
exports.author_update_post = (req, res, next) => {
    const authorId = req.params.id;
    const first_name = req.fields.first_name;
    const family_name = req.fields.family_name;
    const date_of_birth = req.fields.date_of_birth;
    const date_of_death = req.fields.date_of_death;

    // 校验参数
    try {
        if (!(first_name.length >= 1)) {
            throw new Error('请写入姓')
        }
        if (!(family_name.length >= 1)) {
            throw new Error('请写入名')
        }
    } catch (e) {
        req.flash('error', e.message)
        return res.redirect('/author_form')
    }
    const author = {
        first_name: first_name,
        family_name: family_name,
        date_of_birth: date_of_birth,
        date_of_death: date_of_death,
        _id: authorId
    }
    AuthorModel.findByIdAndUpdate(authorId, author).then(result => {
        console.log(result);
        res.send('更新作者信息ID');
    })
};