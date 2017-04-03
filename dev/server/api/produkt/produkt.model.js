'use strict';

import mongoose from 'mongoose';

var ProduktSchema = new mongoose.Schema({
  titel: String,
  beschreibung: String,
  uri_logo: String,
  link: String
});

export default mongoose.model('Produkt', ProduktSchema);
