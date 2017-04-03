/**
 * Katalog model events
 */

'use strict';

import {EventEmitter} from 'events';
import Katalog from './katalog.model';
var KatalogEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
KatalogEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Katalog.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    KatalogEvents.emit(`${event}:${doc._id}`, doc);
    KatalogEvents.emit(event, doc);
  };
}

export default KatalogEvents;
