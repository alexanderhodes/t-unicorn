/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/kataloge              ->  index
 * POST    /api/kataloge              ->  create
 * GET     /api/kataloge/:id          ->  show
 * PUT     /api/kataloge/:id          ->  upsert
 * PATCH   /api/kataloge/:id          ->  patch
 * DELETE  /api/kataloge/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Katalog from './katalog.model';

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

// Gets a list of Katalog
export function index(req, res) {
  return Katalog.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Katalog from the DB
export function show(req, res) {
  return Katalog.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Katalog in the DB
export function create(req, res) {
  return Katalog.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Katalog in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Katalog.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Katalog in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Katalog.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Katalog from the DB
export function destroy(req, res) {
  return Katalog.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * Füge neue Frage hinzu
 * @param req
 * @param res
 * @returns {*}
 */
export function newQuestion(req, res) {
   var id = req.params.id;
  if(req.body._id) {
    delete req.body._id;
  }
  return Katalog.findOneAndUpdate(
    {_id: req.params.id},
    {$push: {fragen_id: req.body.frageId}},
    {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
/**
 * Lösche Frage
 * @param req
 * @param res
 * @returns {*}
 */
export function deleteQuestion(req, res) {
  var id = req.params.id;
  if(req.body._id) {
    delete req.body._id;
  }
  return Katalog.findOneAndUpdate(
    {_id: req.params.id},
    {$pull: {fragen_id: req.body.frageId}},
    {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
