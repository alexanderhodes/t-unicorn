/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/statements              ->  index
 * POST    /api/statements              ->  create
 * GET     /api/statements/:id          ->  show
 * PUT     /api/statements/:id          ->  upsert
 * PATCH   /api/statements/:id          ->  patch
 * DELETE  /api/statements/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Statement from './statement.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if(entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function(entity) {
    try {
      jsonpatch.apply(entity, patches, /*validate*/ true);
    } catch(err) {
      return Promise.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.remove()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Statements
export function index(req, res) {
  return Statement.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Statement from the DB
export function show(req, res) {
  return Statement.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Statement in the DB
export function create(req, res) {
  return Statement.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Statement in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Statement.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Statement in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Statement.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Statement from the DB
export function destroy(req, res) {
  return Statement.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
