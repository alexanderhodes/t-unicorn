/**
 * Result model events
 */

'use strict';

import {EventEmitter} from 'events';
import Result from './result.model';
var ResultEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ResultEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Result.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ResultEvents.emit(`${event}:${doc._id}`, doc);
    ResultEvents.emit(event, doc);
  };
}

export default ResultEvents;
