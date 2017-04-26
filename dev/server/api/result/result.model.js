'use strict';

import mongoose from 'mongoose';

var ResultSchema = new mongoose.Schema({
  result_text: String
});

export default mongoose.model('Result', ResultSchema);
