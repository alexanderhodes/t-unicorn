'use strict';

var express = require('express');
var controller = require('./katalog.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.get('/', auth.isAuthenticated(),controller.index);
router.get('/:id', auth.isAuthenticated(),controller.show);
router.post('/', auth.isAuthenticated(),controller.create);
router.put('/:id/fragen/new', auth.isAuthenticated(),controller.newQuestion);
router.put('/:id/fragen/delete', auth.isAuthenticated(),controller.deleteQuestion);
router.put('/:id', auth.isAuthenticated(),controller.upsert);
router.patch('/:id', auth.isAuthenticated(),controller.patch);
router.delete('/:id', auth.isAuthenticated(),controller.destroy);

module.exports = router;
