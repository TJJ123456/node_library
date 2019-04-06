const express = require('express');
const router = express.Router();
const managerCheckNotLogin = require('../check/managerCheck').checkNotLogin;
const managerCheckLogin = require('../check/managerCheck').checkLogin;
const managerController = require('../controllers/managerController');

router.get('/manager', (req, res, next) => {
    if (req.session.manager) {
        res.redirect('/manager/main.html');
    } else
        res.redirect('/manager/signin.html');
})

router.post('/manager_signin', managerCheckNotLogin, managerController.signin);
router.get('/manager_signout', managerCheckLogin, managerController.signout);

router.get('/', (req, res, next) => {
    res.redirect('/catalog');
})

module.exports = router;