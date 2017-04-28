/**
 * Produkt model events
 */

'use strict';

import {EventEmitter} from 'events';
import Produkt from './produkt.model';
var ProduktEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProduktEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Produkt.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ProduktEvents.emit(`${event}:${doc._id}`, doc);
    ProduktEvents.emit(event, doc);
  };
}

export default ProduktEvents;
