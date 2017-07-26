var express = require('express');
var router = express.Router();

var mortalForbidden = function (req, res, next) {
	if (req.session.user) {
		res.sendStatus(418);
	} else {
		next();
	}
}

var visitorForbidden = function (req, res, next) {
	if (!req.session.user) {
		res.sendStatus(418);
	} else {
		next();
	}
}

router.get('/', function (req, res, next) {
	res.render('index', { 
		title: 'Touhou! Live!' 
	});
});

var genericApi = require('../controllers/api/genericApi');
router.get('/api/users', genericApi(require('../models/user')));

var userController = require('../controllers/userController');
router.get('/login', mortalForbidden, userController.login);
router.post('/login', mortalForbidden, userController.login_post);

router.get('/signup', mortalForbidden, userController.signup);
router.post('/signup', mortalForbidden, userController.signup_post);

if (isDevelopment)
	router.get('/logout', visitorForbidden, userController.logout_post);

router.get('/users/:uuid', userController.detail);
// router.get('/users', userController.list);

module.exports = router;