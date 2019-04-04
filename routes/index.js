const express = require('express');
const router = express.Router();
const managerCheckNotLogin = require('../check/managerCheck').checkNotLogin;
const managerController = require('../controllers/managerController');

router.get('/manager', (req, res, next) => {
    if (req.session.manager) {
        res.redirect('/manager/index.html');
    } else
        res.redirect('/manager/signin.html');
})

router.post('/manager_signin', managerCheckNotLogin, managerController.signin);

router.get('/', (req, res, next) => {
    res.redirect('/catalog');
})

module.exports = router;