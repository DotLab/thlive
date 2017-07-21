var express = require('express');
var router = express.Router();

var artistController = require('../controllers/artistController');

router.get('/', artistController.list);

router.get('/editor', artistController.editor);
router.post('/editor', artistController.editor_post);

router.get('/:id', artistController.detail);

module.exports = router;
