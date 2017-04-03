/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/Frage              ->  index
 * POST    /api/Frage              ->  create
 * GET     /api/Frage/:id          ->  show
 * PUT     /api/Frage/:id          ->  upsert
 * PATCH   /api/Frage/:id          ->  patch
 * DELETE  /api/Frage/:id          ->  destroy
 */

'use strict';

import jsonpatch from 'fast-json-patch';
import Frage from './frage.model';
import Katalog from '../katalog/katalog.model'

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

// Gets a list of Frage
export function index(req, res) {
  return Frage.find().exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Frage from the DB
export function show(req, res) {
  return Frage.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Frage in the DB
export function create(req, res) {
  return Frage.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res + "test"));
}

// Upserts the given Frage in the DB at the specified ID
export function upsert(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Frage.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()

    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Updates an existing Frage in the DB
export function patch(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Frage.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(patchUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Frage from the DB
export function destroy(req, res) {
  return Frage.findById(req.params.id).exec()
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

/**
 * Gebe Fragen aus dem aktiven Fragekatalog zurück
 *
 * @param req
 * @param res
 * @returns {*}
 */
export function active(req, res) {
  return Katalog.findOne({ist_aktiv: true}).exec()
    .then(catalog => { // don't ever give out the password or salt
      if(!catalog) {
        return res.status(404).end();
      }

      Frage.find({
        _id: { $in: catalog.fragen_id }}).exec()
        .then(fragen => {
          if (!fragen) {
            return res.status(404).end();
          }
          res.json(fragen);
        });


    })
    .catch(err => next(err));
}

/**
 * Ändere Antwort
 *
 * @param req
 * @param res
 * @returns {*}
 */
export function editAnswer(req, res) {
  var id = req.params.id;
  if(req.body._id) {
    delete req.body._id;
  }
  return Frage.findOneAndUpdate(
    { '_id': req.params.id,
      'antworten._id': req.body.antwortId
    },
    {    $set:
      {
        'antworten.$.antwort_text': req.body.antwort_text
      }
    },
    {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Füge eine Antwort hinzu
 *
 * @param req
 * @param res
 * @returns {*}
 */
export function addAnswer(req, res) {
  if(req.body._id) {
    delete req.body._id;
  }
  return Frage.findOneAndUpdate(
    { '_id': req.params.id,
    },
    {    $push:
      {
        'antworten': { antwort_text: "Trage einen Antworttext ein", produkte: [] }
      }
    },
    {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Lösche eine Antwort
 *
 * @param req
 * @param res
 * @returns {*}
 */
export function deleteAnswer(req, res) {
  var id = req.params.id;
  if(req.body._id) {
    delete req.body._id;
  }
  return Frage.findOneAndUpdate(
    { '_id': req.params.id
    },
    {$pull:
      {'antworten':  { _id : req.body.antwortId }
      }
    },
    {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Füge Produkt einer Antwort hinzu
 *
 * @param req
 * @param res
 * @returns {*}
 */
export function addProductAnswer(req, res) {
  let p_id = req.body.productId;
  let q_id = req.body.questionId;
  let a_id = req.body.answerId;
  let p_points = req.body.points;

  return Frage.findOneAndUpdate(
    { '_id': q_id,
      'antworten._id': a_id
    },
    {    $push:
      {
        'antworten.$.produkte': { produkt_id: p_id , punkte: p_points }
      }
    },
    {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Lösche ein Produkt aus einer Antwort
 *
 * @param req
 * @param res
 * @returns {*}
 */
export function deleteProductAnswer(req, res) {
  let p_id = req.body.productId;
  let q_id = req.body.questionId;
  let a_id = req.body.answerId;

  return Frage.findOneAndUpdate(
    { '_id': q_id,
      'antworten._id': a_id
    },
    {    $pull:
      {
        'antworten.$.produkte': { produkt_id: p_id }
      }
    },
    {upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
    .then(respondWithResult(res))
    .catch(handleError(res));
}
