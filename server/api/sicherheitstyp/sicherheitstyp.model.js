'use strict';

import mongoose from 'mongoose';

var SicherheitstypSchema = new mongoose.Schema({
  titel: String,
  beschreibung: String,
  produkte_id: [String]
});

export default mongoose.model('Sicherheitstyp', SicherheitstypSchema);
