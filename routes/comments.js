var express = require('express');
var router = express.Router();

var commentController = require('../controllers/commentController');

router.post('/add', commentController.add);

module.exports = router;
