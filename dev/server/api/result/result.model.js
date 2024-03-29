'use strict';

import mongoose from 'mongoose';

var ResultSchema = new mongoose.Schema({
  risk_text: [String],
  chance_text: [String],
  risk_short_text: [String],
  chance_short_text: [String]
});

export default mongoose.model('Result', ResultSchema);
