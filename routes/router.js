var express = require('express');
var router = express.Router();

var forbid = require('./middlewares/forbid');

router.get('/', function (req, res, next) {
	res.render('index', { 
		title: 'Touhou! Live!' 
	});
});

router.post('/echo/body', (req, res) => res.send(req.body));
router.post('/echo/params', (req, res) => res.send(req.params));
router.post('/echo/session', (req, res) => res.send(req.session));

var genericApi = require('../controllers/api/genericApi');
router.post('/api/users', genericApi(require('../models/user')));

var userController = require('../controllers/userController');
router.get('/login', forbid.user(), userController.login);
router.post('/login', forbid.user(), userController.login_post);

router.get('/signup', forbid.user(), userController.signup);
router.post('/signup', forbid.user(), userController.signup_post);

router.get('/logout', forbid.visitor(), userController.logout_post);

router.get('/users', userController.list);
router.get('/users/editor', forbid.visitor(), userController.editor);
router.post('/users/editor', forbid.visitor(), userController.editor_post);
router.get('/users/:id([a-f0-9]{24})', userController.detail);

var tagController = require('../controllers/tagController');
router.get('/tags', tagController.list);
router.get('/tags/editor', forbid.visitor(), tagController.editor);
router.post('/tags/editor', forbid.visitor(), tagController.editor_post);
router.get('/tags/:id([a-f0-9]{24})', tagController.detail);

module.exports = router;