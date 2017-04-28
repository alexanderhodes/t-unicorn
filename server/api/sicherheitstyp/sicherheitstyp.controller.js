/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/sicherheitstypen              ->  index
 * POST    /api/sicherheitstypen              ->  create
 * GET     /api/sicherheitstypen/:id          ->  show
 * PUT     /api/sicherheitstypen/:id          ->  upsert
 * PATCH   /api/sicherheitstypen/:id          ->  patch
 * DELETE  /api/sicherheitstypen/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Sicherheitstyp from './sicherheitstyp.model';

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

// Gets a list of Sicherheitstypen
export function index(req, res) {
  return Sicherheitstyp.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Sicherheitstyp from the DB
export function show(req, res) {
  return Sicherheitstyp.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Sicherheitstyp in the DB
export function create(req, res) {
  return Sicherheitstyp.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Upserts the given Sicherheitstyp in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Sicherheitstyp.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Sicherheitstyp in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Sicherheitstyp.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Sicherheitstyp from the DB
export function destroy(req, res) {
  return Sicherheitstyp.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
export function addProduct(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Sicherheitstyp.findOneAndUpdate(
    { '_id': req.params.id,
    },
    {    $push:
      {
        'produkte_id' : req.body.produkte_id
      }
    },
    {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Lösche Produkt aus Sicherheitstyp
 * @param req
 * @param res
 * @returns {*}
 */
export function deleteProduct(req, res) {
  var id = req.params.id;
  if(req.body._id) {
    delete req.body._id;
  }
  return Sicherheitstyp.findOneAndUpdate(
    { '_id': req.params.id
    },
    {$pull:
      {'produkte_id' : req.body.produkte_id
      }
    },
    {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
