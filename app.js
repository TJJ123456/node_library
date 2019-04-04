const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');  // 导入 catalog 路由

const app = express();
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost:27017/mylibrary';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB 连接错误：'));

//设置模板目录
app.engine('.html', require('express-art-template'));
app.set('views', path.join(__dirname, 'views'));
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/node_modules',express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(session({
    name: 'nlibrary',
    secret: 'nlibrary',
    resave: true, //强制更新
    saveUninitialized: false,//强制创建session
    cookie: {
        maxAge: 3600 * 24 * 60,//一天？
    },
    store: new MongoStore({
        url: mongoDB
    })
}))

app.use(flash());
app.use(function (req, res, next) {
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
})

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);  // 将 catalog 路由添加进中间件链

app.listen(3000, function () {
    console.log('nlibrary running...');
})