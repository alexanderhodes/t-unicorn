'use strict';

import mongoose from 'mongoose';

var FrageSchema = new mongoose.Schema({
  frage: String,
  rang: Number,
  antworten: [{antwort_text: String, produkte: [{produkt_id: String, punkte: Number}] }]
});

export default mongoose.model('Frage', FrageSchema);
