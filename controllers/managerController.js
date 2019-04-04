exports.signin = (req, res, next) => {
    if (req.body.username === 'admin' && req.body.password === '123') {
        req.session.manager = true;
        res.json({
            status: 1//成功
        })
    } else {
        res.json({
            status: 2//失败
        })
    }

}