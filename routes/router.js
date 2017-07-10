var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
	res.render('index', { 
		title: 'Touhou! Live!' 
	});
});

router.use('/users', require('./users'));

router.use('/api', require('./api'));

module.exports = router;
