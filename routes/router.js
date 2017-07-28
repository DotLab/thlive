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
				doc.update({ active_date: Date.now() }).exec();
				
				next();
			}).catch(err => forbid(res, err));
		} else {
			forbid(res);
		}
	};
};

forbidUser = function () {
	return function (req, res, next) {
		if (req.session.user) forbid(res);
		else next();
	};
};

router.get('/', function (req, res, next) {
	res.render('index', { 
		title: 'Touhou! Live!' 
	});
});

if (isDevelopment) {
	router.post('/echo/body', (req, res) => res.send(req.body));
	router.post('/echo/params', (req, res) => res.send(req.params));
	router.post('/echo/session', (req, res) => res.send(req.session));
	router.post('/echo/bindf', (req, res) => res.send(req.bindf));

	var developmentApi = require('../controllers/api/developmentApi');
	router.post('/api/users', developmentApi(require('../models/user')));

	router.post('/api/tags', developmentApi(require('../models/tag')));
	router.post('/api/tagdesignations', developmentApi(require('../models/tagdesignation')));
	
	router.post('/api/images', developmentApi(require('../models/image')));
	
	router.post('/api/cards', developmentApi(require('../models/card')));
	router.post('/api/cardinstances', developmentApi(require('../models/cardinstance')));
	
	router.post('/api/edits', developmentApi(require('../models/edit')));
	router.post('/api/votes', developmentApi(require('../models/vote')));
}

var userController = require('../controllers/userController');
router.get('/users', userController.list);
router.get('/login', forbidUser(), userController.login);
router.post('/login', forbidUser(), userController.login_post);
router.get('/signup', forbidUser(), userController.signup);
router.post('/signup', forbidUser(), userController.signup_post);
if (isDevelopment)
	router.get('/logout', forbidVisitor(), userController.logout);

router.get('/users/:id([a-f0-9]{24})', userController.detail);
router.get('/users/:id([a-f0-9]{24})/edit', forbidVisitor(), userController.edit);
router.post('/users/:id([a-f0-9]{24})/edit', forbidVisitor(), userController.edit_post);

var tagController = require('../controllers/tagController');
router.get('/tags', tagController.list);
router.get('/tags/create', forbidVisitor(), tagController.create);
router.post('/tags/create', forbidVisitor(), tagController.create_post);

router.get('/tags/:id([a-f0-9]{24})', tagController.detail);
router.get('/tags/:id([a-f0-9]{24})/edit', forbidVisitor(), tagController.edit);
router.post('/tags/:id([a-f0-9]{24})/edit', forbidVisitor(), tagController.edit_post);

// var imageController = require('../controllers/imageController');
// router.get('/images', imageController.list);
// router.get('/images/editor', forbidVisitor(), imageController.editor);
// router.post('/images/editor', forbidVisitor(), imageController.editor_post);
// router.get('/images/:id([a-f0-9]{24})', imageController.detail);

var reviewController = require('../controllers/reviewController');
router.get('/review', forbidVisitor(), reviewController.list);
router.get('/review/tag', forbidVisitor(), reviewController.tag);
router.post('/review/tag', forbidVisitor(), reviewController.tag_post);
router.get('/review/tag/:id([a-f0-9]{24})', forbidVisitor(), reviewController.tag_readonly);
// router.get('/review/image', forbidVisitor(), reviewController.image);
// router.get('/review/card', forbidVisitor(), reviewController.card);

module.exports = router;