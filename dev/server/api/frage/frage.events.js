/**
 * Frage model events
 */

'use strict';

import {EventEmitter} from 'events';
import Frage from './frage.model';
var FrageEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
FrageEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Frage.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    FrageEvents.emit(`${event}:${doc._id}`, doc);
    FrageEvents.emit(event, doc);
  };
}

export default FrageEvents;
