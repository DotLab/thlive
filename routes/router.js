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

module.exports = router;
