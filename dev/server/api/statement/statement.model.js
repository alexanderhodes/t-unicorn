'use strict';

import mongoose from 'mongoose';

var StatementSchema = new mongoose.Schema({
  statement_text: String,
  options: [String],
  results: {benefit: String, risk: String},
  points: Number,
  user_option: String
});

export default mongoose.model('Statement', StatementSchema);
