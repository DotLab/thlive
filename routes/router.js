var express = require('express');
var router = express.Router();

router.use('/api', require('./api'));

router.get('/', function (req, res, next) {
	res.render('index', { 
		title: 'Touhou! Live!' 
	});
});

router.use('/users', require('./users'));

router.use('/artists', require('./artists'));
router.use('/images', require('./images'));

router.use('/characters', require('./characters'));
router.use('/cards', require('./cards'));

module.exports = router;
