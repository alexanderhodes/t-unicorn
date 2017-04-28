/**
 * Statement model events
 */

'use strict';

import {EventEmitter} from 'events';
import Statement from './statement.model';
var StatementEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
StatementEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Statement.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    StatementEvents.emit(`${event}:${doc._id}`, doc);
    StatementEvents.emit(event, doc);
  };
}

export default StatementEvents;
