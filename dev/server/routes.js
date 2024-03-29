/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/options', require('./api/option'));
  app.use('/api/statements', require('./api/statement'));
  app.use('/api/results', require('./api/result'));

  app.use('/auth', require('./auth').default);

  app.use('/admin', require('./admin'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  app.get('/', function(req, res) {
    res.redirect(`${app.get('appPath')}/crc.html`);
  });

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(`${app.get('appPath')}/crc.html`));
    });
}
