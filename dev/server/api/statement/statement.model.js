'use strict';

import mongoose from 'mongoose';

var StatementSchema = new mongoose.Schema({
  statement_text: String,
  statement_rank: Number,
  options: [{option_id: String, result_id: String}],
  points: Number
});

export default mongoose.model('Statement', StatementSchema);
