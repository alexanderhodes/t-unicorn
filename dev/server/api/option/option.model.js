'use strict';

import mongoose from 'mongoose';

var OptionSchema = new mongoose.Schema({
  option_text: String,
  valuation: Number
});

export default mongoose.model('Option', OptionSchema);
