var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

router.get('/signup', userController.signup_form);
router.post('/signup', userController.signup);

router.get('/login', userController.login_form);
router.post('/login', userController.login);

router.get('/logout', userController.logout);

module.exports = router;
