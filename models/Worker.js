const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workerSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  profession: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  skills: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Worker', workerSchema, 'Worker_data');
