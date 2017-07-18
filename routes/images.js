var express = require('express');
var router = express.Router();

var imageController = require('../controllers/imageController');

router.get('/', imageController.list);

router.get('/upload', imageController.upload);
router.post('/upload', imageController.upload_post);

router.get('/:id', imageController.detail);

module.exports = router;
