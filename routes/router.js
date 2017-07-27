var express = require('express');
var router = express.Router();

forbid = function (res, err) {
	res.status(418);

	res.render('error', { 
		title: 'Error', 
		error: err || { name: 'Error', message: 'I\'m a teapot', stack: 'You attempt to brew coffee with a teapot.' }
	});
}

var User = require('../models/user');
forbidVisitor = function () {
	return function (req, res, next) {
		if (req.session.user) {
			User.findById(req.session.user).then(doc => {
				req.bindf.user = doc;

				return doc.update({
					date_active: Date.now()
				});
			}).then(doc => {
				next();
			}).catch(err => forbid(res, err));
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
router.post('/echo/bindf', (req, res) => res.send(req.bindf));

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
router.get('/tags', setSection('tags'), tagController.list);
router.get('/tags/editor', forbidVisitor(), setSection('tags'), tagController.editor);
router.post('/tags/editor', forbidVisitor(), setSection('tags'), tagController.editor_post);
router.get('/tags/:id([a-f0-9]{24})', setSection('tags'), tagController.detail);

var queueController = require('../controllers/queueController');
// router.get('/queues', setSection('queues'), queueController.list);
router.get('/queues/tag', forbidVisitor(), setSection('queues'), queueController.tag);
router.post('/queues/tag', forbidVisitor(), setSection('queues'), queueController.tag_post);
router.get('/queues/tag/:id([a-f0-9]{24})', forbidVisitor(), setSection('queues'), queueController.tag_readonly);
// router.get('/queues/image', forbidVisitor(), setSection('queues'), queueController.image);
// router.get('/queues/card', forbidVisitor(), setSection('queues'), queueController.card);

module.exports = router;