'use strict';

var express = require('express');
var controller = require('./frage.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/active', controller.active);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.upsert);
router.put('/:id/antwort/edit', auth.isAuthenticated(), controller.editAnswer);
router.put('/:id/antwort/delete', auth.isAuthenticated(), controller.deleteAnswer);
router.put('/:id/antwort/add', auth.isAuthenticated(), controller.addAnswer);
router.post('/:id/antwort/:id/produkte', auth.isAuthenticated(), controller.addProductAnswer);
router.delete('/:id/antwort/:id/produkte/:id', auth.isAuthenticated(), controller.deleteProductAnswer);
router.patch('/:id', auth.isAuthenticated(), controller.patch);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;
