var express = require('express');
var router = express.Router();

var characterController = require('../controllers/characterController');

router.get('/', characterController.list);

router.get('/add', characterController.add_form);
router.post('/add', characterController.add);

router.get('/:id', characterController.detail);

module.exports = router;
