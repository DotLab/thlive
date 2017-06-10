var express = require('express');
var router = express.Router();

var cardController = require('../controllers/cardController');

// router.get('/', cardController.list);

router.get('/add', cardController.add_form);
router.post('/add', cardController.add);

// router.get('/:id', cardController.detail);

module.exports = router;
