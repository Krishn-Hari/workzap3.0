const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hiredSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Hired', hiredSchema, 'hired');