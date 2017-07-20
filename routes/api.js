var express = require('express');
var router = express.Router();

var genericApi = require('../controllers/api/genericApi');
router.get('/users', genericApi(require('../models/user')));
router.get('/artists', genericApi(require('../models/artist')));
router.get('/images', genericApi(require('../models/image')));
router.get('/characters', genericApi(require('../models/character')));
router.get('/cards', genericApi(require('../models/card')));

var artistApi = require('../controllers/api/artistApi');
router.get('/artists/list', artistApi.list);

var imageApi = require('../controllers/api/imageApi');
router.get('/images/keywords', imageApi.keywords);
router.get('/images/siblings', imageApi.siblings);
router.post('/images/upload', imageApi.upload);

module.exports = router;
