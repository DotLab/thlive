var express = require('express');
var router = express.Router();

var cardController = require('../controllers/cardController');

// router.get('/', cardController.list);

router.get('/editor', cardController.editor);
router.post('/editor', cardController.editor_post);

// router.get('/:id', cardController.detail);

module.exports = router;
