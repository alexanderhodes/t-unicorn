/**
 * Option model events
 */

'use strict';

import {EventEmitter} from 'events';
import Option from './option.model';
var OptionEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
OptionEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for(var e in events) {
  let event = events[e];
  Option.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    OptionEvents.emit(`${event}:${doc._id}`, doc);
    OptionEvents.emit(event, doc);
  };
}

export default OptionEvents;
