var express = require('express');
var router = express.Router();

var userController = require('../controllers/userController');

router.get('/', function(req, res, next) {
	return res.render('index', { 
		title: 'Touhou! Live!' 
	});
});

router.get('/login', userController.login_form);
router.get('/register', userController.register_form);

router.use('/users', require('./users'));
router.use('/artists', require('./artists'));
router.use('/images', require('./images'));
router.use('/characters', require('./characters'));
router.use('/cards', require('./cards'));

router.use('/comments', require('./comments'));

router.use('/api', require('./api'));

module.exports = router;
