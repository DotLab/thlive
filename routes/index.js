var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

router.get('/', function(req, res, next) {
	return res.render('index', { 
		title: 'Touhou! Live!',
		user: req.session.user 
	});
});

router.get('/login', userController.login_form);
router.get('/register', userController.register_form);

module.exports = router;
