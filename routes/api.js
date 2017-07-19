var express = require('express');
var router = express.Router();

var genericApi = require('../controllers/api/genericApi');

var artistApi = require('../controllers/api/artistApi');
var imageApi = require('../controllers/api/imageApi');

var Artist = require('../models/artist');
var Image = require('../models/image');
var Character = require('../models/character');
var Card = require('../models/card');


router.get('/artists', genericApi.find(Artist));
router.get('/artists/list', artistApi.list);
router.get('/artists/:id', genericApi.findById(Artist));

router.get('/images', genericApi.find(Image));
router.get('/images/keywords', imageApi.keywords);
router.get('/images/siblings', imageApi.siblings);
router.post('/images/upload', imageApi.upload);
router.get('/images/:id', genericApi.findById(Image));

router.get('/characters', genericApi.find(Character));
router.get('/characters/:id', genericApi.findById(Character));

router.get('/cards', genericApi.find(Card));
router.get('/cards/:id', genericApi.findById(Card));


module.exports = router;
