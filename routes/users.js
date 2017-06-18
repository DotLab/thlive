var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

router.get('/', userController.list);

router.get('/signup', userController.signup_form);
router.post('/signup', userController.signup);

router.get('/login', userController.login_form);
router.post('/login', userController.login);

router.get('/logout', userController.logout);

router.get('/:id', userController.detail_profile);

router.get('/:id/activity', userController.detail_activity);

module.exports = router;
