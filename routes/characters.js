var express = require('express');
var router = express.Router();

var characterController = require('../controllers/characterController');

router.get('/', characterController.list);

router.get('/editor', characterController.editor);
router.post('/editor', characterController.editor_post);

router.get('/:id', characterController.detail);

module.exports = router;
