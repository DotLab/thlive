var express = require('express');
var router = express.Router();

forbid = function (res) {
	res.status(418);

	res.render('error', { 
		title: 'Error', 
		error: { name: 'Error', message: 'I\'m a teapot', stack: 'You attempt to brew coffee with a teapot.' }
	});
}

forbidVisitor = function () {
	return function (req, res, next) {
		if (req.session.user) {
			next();
		} else {
			forbid(res);
		}
	};
};

forbidUser = function () {
	return function (req, res, next) {
		if (req.session.user) {
			forbid(res);
		} else {
			next();
		}
	};
};

var setSection = function (section) {
	return function (req, res, next) {
		res.locals.section = section;
		next();
	};
};

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
router.get('/login', forbidUser(), setSection('users'), userController.login);
router.post('/login', forbidUser(), setSection('users'), userController.login_post);

router.get('/signup', forbidUser(), setSection('users'), userController.signup);
router.post('/signup', forbidUser(), setSection('users'), userController.signup_post);

router.get('/logout', forbidVisitor(), setSection('users'), userController.logout_post);

router.get('/users', setSection('users'), userController.list);
router.get('/users/editor', forbidVisitor(), setSection('users'), userController.editor);
router.post('/users/editor', forbidVisitor(), setSection('users'), userController.editor_post);
router.get('/users/:id([a-f0-9]{24})', setSection('users'), userController.detail);

var tagController = require('../controllers/tagController');
router.get('/tags', tagController.list);
router.get('/tags/editor', forbidVisitor(), tagController.editor);
router.post('/tags/editor', forbidVisitor(), tagController.editor_post);
router.get('/tags/:id([a-f0-9]{24})', tagController.detail);

var queueController = require('../controllers/queueController');
// router.get('/queues', queueController.list);
router.get('/queues/tag', queueController.tag);
// router.get('/queues/image', queueController.image);
// router.get('/queues/card', queueController.card);

module.exports = router;