'use strict';

var express = require('express');
var controller = require('./statement.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.post('/new', controller.createNew);
router.put('/:id', controller.upsert);
router.put('/:id/updateResult', controller.updateResult);
router.patch('/:id', controller.patch);
router.delete('/:id', controller.destroy);

module.exports = router;
