'use strict';

import mongoose from 'mongoose';

var StatementSchema = new mongoose.Schema({
  name: String,
  info: String,
  active: Boolean
});

export default mongoose.model('Statement', StatementSchema);
