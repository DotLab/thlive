var express = require('express');
var router = express.Router();

var cardController = require('../controllers/cardController');

router.get('/', cardController.list);

router.get('/editor', cardController.editor_form);
router.post('/editor', cardController.editor);

router.get('/:id', cardController.detail);

module.exports = router;
