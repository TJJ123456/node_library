//管理员权限控制
module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.manager) {
            // req.flash('error', '未登录');
            return res.redirect('/manager/signin.html');
        }
        next();
    },
    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.manager) {
            req.flash('error', '已登录');
            return res.redirect('back');
        }
        next();
    }
}
