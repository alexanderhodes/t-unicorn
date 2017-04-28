'use strict';

import mongoose from 'mongoose';

var KatalogSchema = new mongoose.Schema({
  titel: String,
  fragen_id: [String],
  ist_aktiv: Boolean
});

export default mongoose.model('Katalog', KatalogSchema);
