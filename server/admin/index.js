/**
 * Created by vladimirdoroch on 04.01.17.
 */
'use strict';

import {Router} from 'express';
import * as controller from './admin.controller';
import * as auth from '../auth/auth.service';

var router = new Router();

router.get('/', controller.index);
router.get('/settings', auth.isAuthenticated(),controller.settings);


module.exports = router;
