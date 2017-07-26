var express = require('express');
var router = express.Router();

var forbid = require('./middlewares/forbid');

router.get('/', function (req, res, next) {
	res.render('index', { 
		title: 'Touhou! Live!' 
	});
});

var genericApi = require('../controllers/api/genericApi');
router.get('/api/users', genericApi(require('../models/user')));

var userController = require('../controllers/userController');
router.get('/login', forbid.user, userController.login);
router.post('/login', forbid.user, userController.login_post);

router.get('/signup', forbid.user, userController.signup);
router.post('/signup', forbid.user, userController.signup_post);

router.get('/logout', forbid.visitor, userController.logout_post);

router.get('/users', userController.list);
router.get('/users/:id([a-f0-9]{24})', userController.detail);
router.get('/users/:id([a-f0-9]{24})/edit', userController.edit);
router.post('/users/:id([a-f0-9]{24})/edit', userController.edit_post);

module.exports = router;