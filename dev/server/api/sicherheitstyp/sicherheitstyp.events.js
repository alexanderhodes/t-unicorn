/**
 * Sicherheitstyp model events
 */

'use strict';

import {EventEmitter} from 'events';
import Sicherheitstyp from './sicherheitstyp.model';
var SicherheitstypEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
SicherheitstypEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Sicherheitstyp.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    SicherheitstypEvents.emit(`${event}:${doc._id}`, doc);
    SicherheitstypEvents.emit(event, doc);
  };
}

export default SicherheitstypEvents;
